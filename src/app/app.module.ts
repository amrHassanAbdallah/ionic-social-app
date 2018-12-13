import {BrowserModule} from '@angular/platform-browser';
import {ErrorHandler, NgModule} from '@angular/core';
import {IonicApp, IonicErrorHandler, IonicModule} from 'ionic-angular';
import {SplashScreen} from '@ionic-native/splash-screen';
import {StatusBar} from '@ionic-native/status-bar';
import {File} from '@ionic-native/file';
import {FileChooser} from '@ionic-native/file-chooser';
import {FilePath} from '@ionic-native/file-path';

import {environment} from '../environments';

import {AngularFireAuth} from 'angularfire2/auth';
import {AngularFireModule} from 'angularfire2';
import {AngularFirestoreModule} from '@angular/fire/firestore';

import {MyApp} from './app.component';
import {AuthProvider} from '../providers/auth/auth';
import {UserProvider} from '../providers/user/user';
import {ImghandlerProvider} from '../providers/imghandler/imghandler';
import {RequestsProvider} from '../providers/requests/requests';
import {ChatProvider} from '../providers/chat/chat';
import {PostProvider} from '../providers/post/post';
import {PostPage} from "../pages/post/post";
import {FollowProvider} from '../providers/follow/follow';
import {FavoritesProvider} from '../providers/favorites/favorites';
import {PostEditComponent} from "../components/post-edit/post-edit";
import {NotificationsProvider} from "../providers/notifications/notifications";


@NgModule({
  declarations: [
    MyApp,
    PostPage,
    PostEditComponent
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp, {tabsPlacement: 'top'}),
    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule

  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    PostPage,
    PostEditComponent
  ],
  providers: [
    StatusBar,
    SplashScreen,
    File,
    FilePath,
    FileChooser,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    AuthProvider,
    AngularFireAuth,
    UserProvider,
    ImghandlerProvider,
    UserProvider,
    RequestsProvider,
    ChatProvider,
    PostProvider,
    FollowProvider,
    FavoritesProvider,
    NotificationsProvider
  ]
})
export class AppModule {}
