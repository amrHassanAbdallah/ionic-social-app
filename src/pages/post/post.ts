import {Component} from '@angular/core';
import {IonicPage, NavController, NavParams} from 'ionic-angular';
import {PostProvider} from "../../providers/post/post";

/**
 * Generated class for the PostPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-post',
  templateUrl: 'post.html',
})
export class PostPage {

  constructor(public navCtrl: NavController, public navParams: NavParams, public  postService: PostProvider) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad PostPage');
  }

  onAddPost(value: { title: string, content: string }) {
    this.postService.addPost(value);
    this.navCtrl.pop();
  }

}
