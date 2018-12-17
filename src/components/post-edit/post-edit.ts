import {Component} from '@angular/core';
import {PostProvider} from "../../providers/post/post";
import {NavController, NavParams} from "ionic-angular";
import {ImghandlerProvider} from "../../providers/imghandler/imghandler";

/**
 * Generated class for the PostEditComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */

@Component({
  selector: 'post-edit',
  templateUrl: 'post-edit.html'
})
export class PostEditComponent {
  item: any;

  constructor(public navCtrl: NavController, public postService: PostProvider, public navParams: NavParams, public imgHandler: ImghandlerProvider) {
    this.item = navParams.get('item');

  }

  update(key, value: { content: string, title: string }) {
    value.title = value.title ? value.title : key.title;
    value.content = value.content ? value.title : key.content;
    this.postService.updatePost(key.uid, value);
    this.navCtrl.pop();
  }

  uploadImage() {
    let url = this.imgHandler.uploadimage(this.item.uid, '/posts_img');
    console.log(url);

  }
}
