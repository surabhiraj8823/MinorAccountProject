// auth.guard.ts
import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class authGuard implements CanActivate {
  canActivate(): boolean {
    // your logic here
    return true;
  }
}
