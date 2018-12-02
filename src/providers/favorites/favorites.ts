import {Injectable} from '@angular/core';
import firebase from "firebase";
import {Events} from "ionic-angular";

/*
  Generated class for the FavoritesProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class FavoritesProvider {
  firedata = firebase.database().ref('/posts');

  constructor(public events: Events) {
    console.log('Hello FavoritesProvider Provider');
  }

  favorite(userKey, postKey) {
    return new Promise((resolve, reject) => {
      this.firedata.child(userKey).child(postKey).child('/favorites').push({user_id: firebase.auth().currentUser.uid}).then(async () => {
        //and a record for the one he follows under the
        resolve({success: true});
      })
    });
  }

  unFavorite(userKey, postKey) {

  }

}
