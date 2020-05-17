import { Component, ViewEncapsulation, OnInit, ViewChild, ElementRef } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AppComponent implements OnInit {
  title = 'Audio-Lab';
  @ViewChild('canvas', {static: true}) canvas: ElementRef<any>;

  constructor() {}

  ngOnInit() {
    navigator.mediaDevices.getUserMedia({
      audio: true,
      video: false
    }).then((stream) => {
      const context = new AudioContext();
      const source = context.createMediaStreamSource(stream);

      const analyserNode = context.createAnalyser();
      analyserNode.fftSize = 2048;
      const bufferLength = analyserNode.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);
      source.connect(analyserNode);

      const canvas = document.querySelector('canvas');
      const width = canvas.width;
      const height = canvas.height;
      const ctx = canvas.getContext('2d');
      let barHeight;

      const draw = () => {
        requestAnimationFrame(draw);
        analyserNode.getByteFrequencyData(dataArray);

        ctx.fillStyle = '#fff';
        ctx.fillRect(0,0,width,height);

        for(let i = 0; i < bufferLength; i++) {
          barHeight = dataArray[i]/2;
          ctx.fillStyle = '#e6e631';
          ctx.fillRect(0, 0, width, barHeight);
        }
      }

      draw();
    }).catch((err) => {
      alert(err);
    });
  }
}
