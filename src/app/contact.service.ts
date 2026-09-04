import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

export interface InquiryPayload {
  name: string;
  email: string;
  message: string;
  projectName: string;
}

export interface InquiryResponse {
  success: boolean;
  message: string;
}

@Injectable({ providedIn: 'root' })
export class ContactService {
  private readonly http = inject(HttpClient);

  /** Where portfolio inquiries are delivered. */
  readonly contactEmail = 'anbujas18@gmail.com';

  sendInquiry(payload: InquiryPayload): Observable<InquiryResponse> {
    return this.http.post<InquiryResponse>('/api/send-inquiry', payload);
  }
}
