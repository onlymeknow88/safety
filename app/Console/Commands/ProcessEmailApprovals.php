<?php

namespace App\Console\Commands;

use App\Models\AccidentNotification;
use App\Models\MasterData\Status;
use GuzzleHttp\Client as GuzzleClient;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Log;
use Webklex\PHPIMAP\ClientManager;

class ProcessEmailApprovals extends Command
{
    /**
     * The name and signature of the console command.
     */
    protected $signature = 'app:process-email-approvals';

    /**
     * The console command description.
     */
    protected $description = 'Approval via Email menggunakan IMAP OAuth2 (Scope IMAP.AccessAsUser.All)';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $this->info('=== Memulai Sinkronisasi Email Approval (IMAP OAuth2 Flow) ===');

        $tenantId = env('AZURE_TENANT_ID');
        $clientId = env('AZURE_CLIENT_ID');
        $clientSecret = env('AZURE_CLIENT_SECRET');
        $refreshToken = env('AZURE_REFRESH_TOKEN');
        $userEmail = env('IMAP_USERNAME');

        if (! $tenantId || ! $clientId || ! $clientSecret || ! $refreshToken || ! $userEmail) {
            $this->error('Konfigurasi .env belum lengkap!');

            return 1;
        }

        try {
            // 1. Refresh Token menggunakan Guzzle
            $this->info('Refreshing Access Token via Guzzle...');
            $client = new GuzzleClient;
            $response = $client->post("https://login.microsoftonline.com/{$tenantId}/oauth2/v2.0/token", [
                'form_params' => [
                    'client_id' => $clientId,
                    'client_secret' => $clientSecret,
                    'refresh_token' => $refreshToken,
                    'grant_type' => 'refresh_token',
                    'scope' => 'https://outlook.office365.com/IMAP.AccessAsUser.All offline_access',
                ],
            ]);

            if ($response->getStatusCode() !== 200) {
                throw new \Exception('Gagal Refresh Token: '.$response->getBody());
            }

            $data = json_decode($response->getBody(), true);
            $accessToken = $data['access_token'];

            // Log jika ada refresh token baru
            if (isset($data['refresh_token']) && $data['refresh_token'] !== $refreshToken) {
                $this->warn('Refresh Token BARU diterima! Silakan update .env kamu.');
                // $this->line($data['refresh_token']);
            }

            // 2. Koneksi IMAP menggunakan ClientManager
            $this->info("Menghubungi Server IMAP Outlook ({$userEmail})...");

            $cm = new ClientManager;
            $imapClient = $cm->make([
                'host' => 'outlook.office365.com',
                'port' => 993,
                'encryption' => 'ssl',
                'validate_cert' => false,
                'username' => $userEmail,
                'password' => $accessToken,
                'protocol' => 'imap',
                'authentication' => 'oauth',
            ]);

            $imapClient->connect();
            $folder = $imapClient->getFolderByName('INBOX');
            $messages = $folder->query()->subject('RE: TES #')->get();
            $this->info('Ditemukan '.$messages->count().' email baru.');

            foreach ($messages as $message) {
                $subject = (string) $message->getSubject();
                $this->info('Memproses Email: '.$subject);

                if (preg_match('/#(\d+)/', $subject, $matches)) {
                    $notificationId = $matches[1];
                    $notification = AccidentNotification::find($notificationId);

                    if ($notification) {
                        // 1. Ambil Body
                        $body = $message->getHTMLBody() ?: $message->getTextBody();

                        // 2. Buang isi tag <style>, <script>, dan <head>
                        $body = preg_replace('/<(style|script|head)\b[^>]*>.*?<\/\1>/is', '', $body);

                        // 3. Buang semua tag HTML
                        $cleanText = strip_tags($body);

                        // 4. Buang karakter non-alfabet dan ambil huruf pertama
                        $onlyLetters = preg_replace('/[^a-zA-Z]/', '', $cleanText);
                        $this->info("Only Letters: {$onlyLetters}");

                        $firstChar = strtolower(substr($onlyLetters, 0, 1));

                        $this->info("ID #{$notificationId} | Detected Char: '{$firstChar}'");

                        $from = $message->getFrom();
                        $approverEmail = isset($from[0]) ? $from[0]->mail : 'Unknown';

                        $statusUpdate = null;
                        if ($firstChar === 'y') {
                            $statusUpdate = Status::firstOrCreate(['name' => 'Approved'], ['is_active' => true]);
                            $this->info('>>> APPROVED');
                        } elseif ($firstChar === 'n') {
                            $statusUpdate = Status::firstOrCreate(['name' => 'Rejected'], ['is_active' => true]);
                            $this->info('>>> REJECTED');
                        }

                        if ($statusUpdate) {
                            $notification->update([
                                'status_id' => $statusUpdate->id,
                            ]);

                            // Tandai Terbaca
                            $message->setFlag('Seen');
                        }
                    }
                }
            }

        } catch (\Exception $e) {
            $this->error('Error: '.$e->getMessage());
            Log::error('Email Approval Error: '.$e->getMessage());
        }

        $this->info('=== Selesai ===');

    }
}
