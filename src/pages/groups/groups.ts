import {Component} from '@angular/core';
import {Events, IonicPage, NavController, NavParams} from 'ionic-angular';
import {PostPage} from "../post/post";
import {PostProvider} from "../../providers/post/post";

/**
 * Generated class for the GroupsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-groups',
  templateUrl: 'groups.html',
})
export class GroupsPage {
  myFeed;

  constructor(public navCtrl: NavController, public navParams: NavParams, public events: Events, public postService: PostProvider) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad GroupsPage');
  }

  ionViewWillEnter() {
    this.postService.getAll();
    this.events.subscribe('posts', () => {
      this.myFeed = this.postService.myFeed;
    })
  }

  onAddPost() {
    console.log("test");
    this.navCtrl.push(PostPage)
  }

}
