import {Component, NgZone} from '@angular/core';
import {IonicPage, NavController, NavParams} from 'ionic-angular';
import {UserProvider} from "../../providers/user/user";
import {ImghandlerProvider} from "../../providers/imghandler/imghandler";
import {FavoritesProvider} from "../../providers/favorites/favorites";
import firebase from "firebase";

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
  total_favorite_count = null;
  is_fav_by_me;
  post_title;
  created_at;
  post_content;
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public userService: UserProvider,
    public imgHandler: ImghandlerProvider,
    public zone: NgZone,
    public favoritesService: FavoritesProvider
  ) {
    this.post_id = navParams.get('post_id');
    this.user_id = navParams.get("user_id");
    this.post = navParams.get('post');

    //should get post details

    //todo should later get the post image
  }

  ionViewWillEnter() {
    console.log("will enter event ");
    this.post_title = this.post_id.title;
    this.created_at = (new Date(this.post.created_at)).toDateString();
    this.post_content = this.post.content;
    this.isItFavoritedByMe();
    this.setUpPostOwner();
    this.countFavorites();
  }

  async setUpPostOwner() {
    this.user = await this.userService.getuserdetails(this.user_id);
    this.user.uid = this.user_id;
    this.zone.run(async () => {
      this.post.user = this.user;
      this.user_name = this.user.displayName;
      this.user_image = await this.imgHandler.getAuserImage(this.user_id);
    })
    // this.user.photoURL =

  }

  ionViewDidLoad() {

  }

  markAsFavorite() {
    this.favoritesService.favorite(this.user_id, this.post_id).then((res: any) => {
      if (res.success) {
        console.log("success ");
        this.is_fav_by_me = true;
        this.total_favorite_count++;

      }
    }).catch((err) => {
      alert(err);
    })
  }

  markAsunFavorite() {

    this.favoritesService.unFavorite(this.user_id, this.post_id).then((res: any) => {
      if (res.success) {
        console.log("success ");
        this.is_fav_by_me = false;
        this.total_favorite_count--;

      }
    }).catch((err) => {
      alert(err);
    })
  }

  countFavorites() {
    let numberOfFavorites = 0;
    for (let i in this.post.favorites) {
      numberOfFavorites++;
    }
    this.total_favorite_count = numberOfFavorites;
  }

  isItFavoritedByMe() {
    let post = this.post;
    //loop throw the the post favorites and check if there is a user id equal to mine
    for (let location in     post.favorites) {
      if (post.favorites[location].user_id == firebase.auth().currentUser.uid) {
        this.is_fav_by_me = true;
      }
    }
  }
}
