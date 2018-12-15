import {Component} from '@angular/core';
import {IonicPage, NavController, NavParams} from 'ionic-angular';
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
  myNotification = [];

  constructor(public navCtrl: NavController, public navParams: NavParams, public notificationService: NotificationsProvider, public userService: UserProvider, public imageHandler: ImghandlerProvider, public postService: PostProvider) {
  }

  ionViewWillEnter() {
    this.notificationService.get(firebase.auth().currentUser.uid).then(async notifications => {
      let localNotifications = [];
      for (let i in notifications) {
        let object = notifications[i];
        object.uid = i;
        object.user = await this.userService.getuserdetails(object.user_id);
        object.user.photoURL = await this.imageHandler.getAuserImage(object.user_id);
        switch (object.model_type) {
          case "favorite":
            object.message = `${object.user.displayName} favorite  your  post . `;
            break;
          case "unfavorite":
            object.message = `${object.user.displayName} un favorite  your  post . `;
            break;
          case "follow":
            console.log("follow");
            object.message = `${object.user.displayName} followed you . `;
            break;
        }
        localNotifications.push(object);
      }
      this.myNotification = localNotifications;
    })
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad NotificationPage');
  }

  showTargetedNotificationPage(notification: { user_id: string, model_id: string, model_type: string, seen: boolean }) {
    let page = this.getTargetedPage(notification.model_type);
    this.getPageRequiredObject(page, notification.model_id).then(required_obj => {
      this.navCtrl.push(page, required_obj);
    });
  }

  private getTargetedPage(model_type: string) {
    let targeted_model;
    switch (model_type) {
      case "favorite":
      case "unfavorite":
        targeted_model = 'PostSinglePage';
        break;
      case "follow":
        targeted_model = 'ProfilePage';
        break;
    }
    return targeted_model;
  }

  private getPageRequiredObject(page: string, model_id: string) {
    return new Promise(async (resolve, reject) => {
      let required_obj;
      switch (page) {
        case "PostSinglePage":
          required_obj = {
            post_id: model_id,
            user_id: firebase.auth().currentUser.uid,
            post: await this.postService.getSpecificPostForUser(firebase.auth().currentUser.uid, model_id)
          };
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
