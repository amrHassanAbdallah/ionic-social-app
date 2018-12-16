import {Component} from '@angular/core';
import {Events, IonicPage, NavController, NavParams, ToastController} from 'ionic-angular';
import {NotificationsProvider} from "../../providers/notifications/notifications";
import firebase from "firebase";
import {UserProvider} from "../../providers/user/user";
import {ImghandlerProvider} from "../../providers/imghandler/imghandler";
import {ProfilePage} from "../profile/profile";
import {PostProvider} from "../../providers/post/post";

/**
 * Generated class for the NotificationPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-notification',
  templateUrl: 'notification.html',
})
export class NotificationPage {
  myNotification: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, public notificationService: NotificationsProvider, public userService: UserProvider, public imageHandler: ImghandlerProvider, public postService: PostProvider, public toastCtrl: ToastController, public events: Events) {
  }

  ionViewWillEnter() {
    this.notificationService.get(firebase.auth().currentUser.uid);
    this.events.subscribe('notifications', () => {
      this.myNotification = this.notificationService.my_notification;
    })


  }


  ionViewDidLoad() {
    console.log('ionViewDidLoad NotificationPage');
  }

  showTargetedNotificationPage(notification: { user_id: string, model_id: string, model_type: string, seen: boolean }) {
    let page = this.getTargetedPage(notification.model_type);
    this.getPageRequiredObject(page, notification.model_id, notification.user_id, notification.model_type).then(required_obj => {
      if (page && required_obj) {
        this.navCtrl.push(page, required_obj);
      } else {
        var toaster = this.toastCtrl.create({
          duration: 3000,
          position: 'bottom'
        });
        toaster.setMessage('The post is no longer active .');
        toaster.present();
      }
    });

    if (!notification.seen) {
      notification.seen = true;
      this.notificationService.updateNotification(notification);
    }
  }

  private getTargetedPage(model_type: string) {
    let targeted_model;
    switch (model_type) {
      case "favorite":
      case "unfavorite":
      case "post":
        targeted_model = 'PostSinglePage';
        break;
      case "follow":
        targeted_model = 'ProfilePage';
        break;
    }
    return targeted_model;
  }

  private getPageRequiredObject(page: string, model_id: string, user_id: string, model_type: string) {
    return new Promise(async (resolve, reject) => {
      let required_obj;
      switch (page) {
        case "PostSinglePage":
          // from user should be the image but will fetch the post from the current signed in user iif it's favorite
          // or unfavorite
          let postOwnerID = (model_type == 'favorite' || model_type == 'unfavorite' ? firebase.auth().currentUser.uid : user_id);
          let post = await this.postService.getSpecificPostForUser(postOwnerID, model_id);
          if (post) {
            required_obj = {
              post_id: model_id,
              user_id: postOwnerID,
              post
            };
          }
          break;
        case "ProfilePage":
          required_obj = {
            user: await this.userService.getuserdetails(model_id)
          };
          break;
      }
      resolve(required_obj)
    });

  }
}
