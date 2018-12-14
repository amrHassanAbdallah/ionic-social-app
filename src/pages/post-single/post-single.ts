import {Component, NgZone} from '@angular/core';
import {IonicPage, NavController, NavParams} from 'ionic-angular';
import {UserProvider} from "../../providers/user/user";
import {ImghandlerProvider} from "../../providers/imghandler/imghandler";

/**
 * Generated class for the PostSinglePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-post-single',
  templateUrl: 'post-single.html',
})
export class PostSinglePage {
  post;
  post_id;
  user_id;
  user;
  user_image;
  user_name;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public userService: UserProvider,
    public imgHandler: ImghandlerProvider,
    public zone: NgZone
  ) {
    this.post_id = navParams.get('post_id');
    this.user_id = navParams.get("user_id");
    this.post = navParams.get('post');

    //should get post details

    //todo should later get the post image
  }

  ionViewWillEnter() {
    console.log("will enter event ");
    this.setUpPostOwner();
  }

  async setUpPostOwner() {
    this.user = await this.userService.getuserdetails(this.user_id);
    this.zone.run(async () => {
      this.user_name = this.user.displayName;
      this.user_image = await this.imgHandler.getAuserImage(this.user_id);
    })
    // this.user.photoURL =

  }

  ionViewDidLoad() {

  }


}
