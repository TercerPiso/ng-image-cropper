import { AfterViewInit, Component, Input, OnInit, ViewChild } from '@angular/core';
import { Point, Size } from './cropper.model';

@Component({
  selector: 'ic-cropper',
  templateUrl: './cropper.component.html',
  styleUrls: ['./cropper.component.scss']
})
export class CropperComponent implements OnInit, AfterViewInit {

  @Input() initialImage?: string;
  @Input() width: number = 200;
  @Input() height: number = 200;
  @Input() cropWidth: number = 100;
  @Input() cropHeight: number = 100;
  @Input() rounded = false;

  @ViewChild('cropperCanvas') cropperCanvas!: {nativeElement: HTMLCanvasElement};
  @ViewChild('croppedCanvas') croppedCanvas!: {nativeElement: HTMLCanvasElement};
  @ViewChild('workArea') workArea!: {nativeElement: HTMLDivElement};

  private canvas!: HTMLCanvasElement;
  public context?: CanvasRenderingContext2D;
  public croppedContext?: CanvasRenderingContext2D;
  public zoom = 50;
  public img: HTMLImageElement = new Image();
  public arImg: number = 1;

  public clickPressed: boolean = false;

  public icPoint: Point = new Point(0,0);
  public imagePosition: Point = new Point(0,0);
  public currentImagePosition: Point = new Point(0,0);

  public imageSize = new Size(0,0);

  constructor() {
    this.img.onload = () => {
      URL.revokeObjectURL(this.img.src);
      const arCanvas = this.width/this.height;
      // TODO: considerar el aspect ratio del canvas.
      if(this.img.width>this.img.height){
        this.arImg = this.img.height/this.img.width;
        this.imageSize.width = this.width;
        this.imageSize.height = this.arImg * this.height;
      } else if(this.img.width<this.img.height) {
        this.arImg = this.img.width/this.img.height;
        this.imageSize.width = this.width * this.arImg;
        this.imageSize.height = this.height;
      } else {
        this.imageSize.width = this.width;
        this.imageSize.height = this.height;
      }
      this.drawImage();
    };
  }

  ngAfterViewInit(): void {
    this.workArea.nativeElement.addEventListener('mousedown', (d) => {
      this.clickPressed =true;
      this.icPoint = new Point(d.pageX, d.pageY);
      this.imagePosition = Object.assign({}, this.currentImagePosition);
    });
    this.workArea.nativeElement.addEventListener('mouseup', (d) => {
      this.clickPressed = false;
    });
    this.workArea.nativeElement.addEventListener('mouseout', (d) => {
      this.clickPressed = false;
    });
    this.workArea.nativeElement.addEventListener('mousemove', (d) => {
      if(this.clickPressed) {
        const deltaMousePosition = new Point(
          d.pageX - this.icPoint.x,
          d.pageY - this.icPoint.y
        );
        this.currentImagePosition.x = this.imagePosition.x + deltaMousePosition.x;
        this.currentImagePosition.y = this.imagePosition.y + deltaMousePosition.y;
        this.drawImage();
      }
    });
  }

  ngOnInit(): void {

  }

  loadImage(data: string) {
    this.canvas = this.cropperCanvas.nativeElement;
    this.context = this.canvas.getContext('2d') as CanvasRenderingContext2D;
    this.croppedContext = this.croppedCanvas.nativeElement.getContext('2d') as CanvasRenderingContext2D;
    this.img.src = data;
  }

  drawImage() {
    this.context!.clearRect(0, 0, this.width, this.height);
    this.context!.fillStyle = 'white';
    this.context!.fillRect(0, 0, this.width, this.height);
    const finalWidth = this.zoom * this.imageSize.width / 50;
    const finalHeight = this.zoom * this.imageSize.height / 50;
    this.context!.drawImage(this.img,
      ((this.width / 2) - (finalWidth / 2)) + this.currentImagePosition.x,
      ((this.height / 2) - (finalHeight / 2)) + this.currentImagePosition.y,
      finalWidth,
      finalHeight
    );
    this.calcCrop();
  }

  calcCrop() {
    const imgData = this.getImageData();
    this.croppedContext!.clearRect(0, 0, this.width, this.height);
    this.croppedContext!.putImageData(imgData, 0, 0);
  }

  getImageData() {
    return this.context!.getImageData((this.width/2) - (this.cropWidth/2), (this.height/2) - (this.cropHeight/2), this.cropWidth, this.cropHeight);
  }

  save() {
    return this.croppedCanvas.nativeElement.toDataURL('image/jpeg', 1);
  }

}
