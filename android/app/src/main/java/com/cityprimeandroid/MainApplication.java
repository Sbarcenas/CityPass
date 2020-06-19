package com.cityprimeandroid;

import android.app.Application;

import com.facebook.react.ReactApplication;

import io.invertase.firebase.analytics.RNFirebaseAnalyticsPackage;

import com.RNFetchBlob.RNFetchBlobPackage;
//import com.devicetoken.RNDeviceTokenPackage;
import com.reactnativecommunity.netinfo.NetInfoPackage;

import org.reactnative.camera.RNCameraPackage;
import io.invertase.firebase.notifications.RNFirebaseNotificationsPackage; // <-- Add this line
import com.horcrux.svg.SvgPackage;
import com.BV.LinearGradient.LinearGradientPackage;

import io.invertase.firebase.RNFirebasePackage;

import com.robinpowered.react.Intercom.IntercomPackage;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;
import com.facebook.soloader.SoLoader;

import com.facebook.CallbackManager;
import com.facebook.FacebookSdk;
import com.facebook.reactnative.androidsdk.FBSDKPackage;
import com.facebook.appevents.AppEventsLogger;

//MIXPANEL
import com.kevinejohn.RNMixpanel.*;
// INTERCOM
import com.robinpowered.react.Intercom.IntercomPackage;

import io.intercom.android.sdk.Intercom;
//FIREBASE
import io.invertase.firebase.RNFirebasePackage;
import io.invertase.firebase.links.RNFirebaseLinksPackage;
import io.invertase.firebase.messaging.RNFirebaseMessagingPackage; // <-- Add this line
import io.invertase.firebase.analytics.RNFirebaseAnalyticsPackage;
import com.reactnativenavigation.NavigationApplication;
import com.reactnativenavigation.react.NavigationReactNativeHost;
import com.reactnativenavigation.react.ReactGateway;

import io.realm.react.RealmReactPackage; // realm

import java.util.Arrays;
import java.util.List;

public class MainApplication extends NavigationApplication {
    private static CallbackManager mCallbackManager = CallbackManager.Factory.create();

    protected static CallbackManager getCallbackManager() {
        return mCallbackManager;
    }

    @Override
    protected ReactGateway createReactGateway() {
        ReactNativeHost host = new NavigationReactNativeHost(this, isDebug(), createAdditionalReactPackages()) {
            @Override
            protected String getJSMainModuleName() {
                return "index";
            }
        };
        Intercom.initialize(this, "android_sdk-c1747b2248f196858a269f3afd572f9affd266b9", "zilig7bs");
        return new ReactGateway(this, isDebug(), host);
    }

    @Override
    public boolean isDebug() {
        return BuildConfig.DEBUG;
    }

    protected List<ReactPackage> getPackages() {
        // Add additional packages you require here
        // No need to add RnnPackage and MainReactPackage
        return Arrays.<ReactPackage>asList(
                new RNMixpanel(),
                new IntercomPackage(),
                new RNFirebasePackage(),
                new RNFirebaseLinksPackage(),
                new RNFirebaseMessagingPackage(),
                new LinearGradientPackage(),
                new SvgPackage(),
                new RNCameraPackage(),
                new FBSDKPackage(mCallbackManager),
                new NetInfoPackage(),
                new RealmReactPackage(),
                new RNFetchBlobPackage(),
                new RNFirebaseAnalyticsPackage(),
                new RNFirebaseNotificationsPackage()
                // eg. new VectorIconsPackage()
        );
    }

    @Override
    public List<ReactPackage> createAdditionalReactPackages() {
        return getPackages();
    }





}
