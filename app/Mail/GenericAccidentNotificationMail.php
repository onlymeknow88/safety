<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Mail\Mailables\Attachment;
use Illuminate\Queue\SerializesModels;

class GenericAccidentNotificationMail extends Mailable
{
    use Queueable, SerializesModels;

    public $subject;
    public $body;
    public $attachmentsData;

    /**
     * Create a new message instance.
     */
    public function __construct($subject, $body, $attachmentsData = [])
    {
        $this->subject = $subject;
        $this->body = $body;
        $this->attachmentsData = $attachmentsData;
    }

    /**
     * Get the message envelope.
     */
    public function envelope(): Envelope
    {
        return new Envelope(
            subject: $this->subject,
        );
    }

    /**
     * Get the message content definition.
     */
    public function content(): Content
    {
        return new Content(
            view: 'emails.generic-accident-notification',
            with: [
                'body' => $this->body,
            ],
        );
    }

    /**
     * Get the attachments for the message.
     *
     * @return array<int, \Illuminate\Mail\Mailables\Attachment>
     */
    public function attachments(): array
    {
        $attachments = [];

        foreach ($this->attachmentsData as $attachment) {
            if (isset($attachment['path'])) {
                $attachments[] = Attachment::fromPath($attachment['path'])
                    ->as($attachment['name']);
            } elseif (isset($attachment['data'])) {
                $attachments[] = Attachment::fromData(fn () => $attachment['data'], $attachment['name'])
                    ->withMime($attachment['mime']);
            }
        }

        return $attachments;
    }
}
