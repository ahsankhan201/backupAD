import { Component, OnInit } from '@angular/core';
import { AnimationModel } from 'src/app/common/models/global.model';
import { ANIMATION_JSON, SECURITY_TIPS_CONST } from '../../../global-constants';

@Component({
  selector: 'app-loader',
  templateUrl: './loader.component.html',
  styleUrls: ['./loader.component.scss']
})
export class LoaderComponent implements OnInit {

  loaderAnimation: AnimationModel;
  constructor() { }

  ngOnInit() {
    this.loaderAnimation = {
      path: ANIMATION_JSON.LOADER_JSON,
      renderer: SECURITY_TIPS_CONST.SVG,
      loop: true,
      autoplay: true
    };
  }

}
