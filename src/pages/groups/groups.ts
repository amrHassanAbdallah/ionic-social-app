import {Component} from '@angular/core';
import {Events, IonicPage, NavController, NavParams} from 'ionic-angular';
import {PostPage} from "../post/post";
import {PostProvider} from "../../providers/post/post";
import {FavoritesProvider} from "../../providers/favorites/favorites";
import firebase from "firebase";

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

  constructor(public navCtrl: NavController, public navParams: NavParams, public events: Events, public postService: PostProvider, public favoritesService: FavoritesProvider) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad GroupsPage');
  }

  ionViewWillEnter() {
    this.postService.getAll();
    this.events.subscribe('posts', () => {
      this.myFeed = this.postService.myFeed;
      this.myFeed.map(post => {
        this.isItFavoritedByMe(post)
      })
    })
  }

  onAddPost() {
    console.log("test");
    this.navCtrl.push(PostPage)
  }

  isItFavoritedByMe(post) {
    //loop throw the the post favorites and check if there is a user id equal to mine
    for (let location in post.favorites) {
      if (post.favorites[location].user_id == firebase.auth().currentUser.uid) {
        post.isFavoritedByMe = true;
      }
    }
  }

  markAsFavorite(item: any) {
    console.log(item.user.uid, item.uid);
    this.favoritesService.favorite(item.user.uid, item.uid).then((res: any) => {
      if (res.success) {
        console.log("success ");
        item.isFavoritedByMe = true;

      }
    }).catch((err) => {
      alert(err);
    })
  }

  markAsunFavorite(item) {
    console.log(item.user.uid, item.uid, item);

    this.favoritesService.unFavorite(item.user.uid, item.uid).then((res: any) => {
      if (res.success) {
        console.log("success ");
        item.isFavoritedByMe = false;

      }
    }).catch((err) => {
      alert(err);
    })
  }
}
