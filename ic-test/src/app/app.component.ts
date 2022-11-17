import { Component, ViewChild } from '@angular/core';
import { CropperComponent } from './cropper/cropper.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  @ViewChild('filUp') filUp?: {nativeElement: HTMLInputElement};

  @ViewChild('icCropper') icCropper?: CropperComponent;

  rounded = false;
  rules = false;

  title = 'ic-test';

  public binaryData?: string;
  public imageURL?: string;

  uploadImage() {
    this.filUp?.nativeElement.click();
  }

  onUpload(evt: any) {
    const file = evt.target.files[0];
    const fr = new FileReader();
    fr.onloadend = (d) =>{
      this.binaryData = d.target!.result as string;
      console.log(this.icCropper);
      this.icCropper?.loadImage(this.binaryData);
    };
    fr.readAsDataURL(file);
  }

  save() {
    this.imageURL = this.icCropper?.save();
  }
}
