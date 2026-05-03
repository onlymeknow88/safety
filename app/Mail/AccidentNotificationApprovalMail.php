<?php

namespace App\Mail;

use App\Models\AccidentNotification;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class AccidentNotificationApprovalMail extends Mailable
{
    use Queueable, SerializesModels;

    public $notification;

    /**
     * Create a new message instance.
     */
    public function __construct(AccidentNotification $notification)
    {
        $this->notification = $notification;
    }

    /**
     * Build the message.
     */
    public function build()
    {
        return $this->subject('[#' . $this->notification->id . '] Approval Diperlukan: Notifikasi Kecelakaan #' . $this->notification->accident_number)
                    ->view('emails.accident_notification_approval');
    }
}
