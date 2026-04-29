<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\AppSetting;
use Illuminate\Support\Facades\Auth;
use Laravel\Socialite\Facades\Socialite;
use Illuminate\Support\Str;

class AzureAuthController extends Controller
{
    public function redirectToAzure()
    {
        $this->configAzure();
        return Socialite::driver('azure')->redirect();
    }

    public function handleAzureCallback()
    {
        $this->configAzure();

        try {
            $azureUser = Socialite::driver('azure')->user();
        } catch (\Exception $e) {
            return redirect('/login')->with('error', 'Azure login failed: ' . $e->getMessage());
        }

        $user = User::updateOrCreate([
            'email' => $azureUser->email,
        ], [
            'name' => $azureUser->name,
            'azure_id' => $azureUser->id,
            'azure_token' => $azureUser->token,
            'azure_refresh_token' => $azureUser->refreshToken,
            'password' => $azureUser->password ?? bcrypt(Str::random(16)), // Fallback password
        ]);

        Auth::login($user);

        return redirect()->intended('/dashboard');
    }

    private function configAzure()
    {
        config([
            'services.azure.client_id' => AppSetting::getValue('azure_client_id', env('AZURE_CLIENT_ID')),
            'services.azure.client_secret' => AppSetting::getValue('azure_client_secret', env('AZURE_CLIENT_SECRET')),
            'services.azure.tenant' => AppSetting::getValue('azure_tenant_id', env('AZURE_TENANT_ID')),
            'services.azure.redirect' => AppSetting::getValue('azure_redirect_uri', env('AZURE_REDIRECT_URI')),
        ]);
    }
}
