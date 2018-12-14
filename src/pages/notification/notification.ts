import {Component} from '@angular/core';
import {IonicPage, NavController, NavParams} from 'ionic-angular';
import {NotificationsProvider} from "../../providers/notifications/notifications";
import firebase from "firebase";
import {UserProvider} from "../../providers/user/user";
import {ImghandlerProvider} from "../../providers/imghandler/imghandler";
import {ProfilePage} from "../profile/profile";

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

  constructor(public navCtrl: NavController, public navParams: NavParams, public notificationService: NotificationsProvider, public userService: UserProvider, public imageHandler: ImghandlerProvider) {
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

  showTargetedNotificationPage(notification) {
    switch (notification.model_type) {
      case "favorite":
        this.navCtrl.push('PostSinglePage', {
          post_id: notification.model_id,
          user_id: firebase.auth().currentUser.uid
        });
        break;
      case "unfavorite":
        this.navCtrl.push('PostSinglePage', {
          post_id: notification.model_id,
          user_id: firebase.auth().currentUser.uid
        });
        break;
      case "follow":
        console.log("yes indeed I follow ", notification.user_id);
        this.userService.getuserdetails(notification.model_id).then(user => {
          console.log("I follow this man ", user);
          this.navCtrl.push('ProfilePage', {
            user: user
          });
        })

    }

  }

}
