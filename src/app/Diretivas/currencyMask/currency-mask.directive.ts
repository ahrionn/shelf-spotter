import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[appCurrencyMask]'
})
export class CurrencyMaskDirective {

  constructor(private el: ElementRef) {}

  @HostListener('input', ['$event']) onInputChange(event: Event): void {
    const input = this.el.nativeElement as HTMLInputElement;
    let value = input.value.replace(/\D/g, '');
    
    if (value.length === 0) {
      input.value = '';
      return;
    }

    value = (parseInt(value) / 100).toFixed(2);
    value = value.replace('.', ',');
    input.value = `R$ ${value.replace(/\B(?=(\d{3})+(?!\d))/g, '.')}`;
  }

  @HostListener('blur', ['$event']) onBlur(event: Event): void {
    const input = this.el.nativeElement as HTMLInputElement;
    if (input.value === '' || input.value === 'R$ 0,00') {
      input.value = '';
    }
  }
}