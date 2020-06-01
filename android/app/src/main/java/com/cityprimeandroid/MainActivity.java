package com.cityprimeandroid;

import android.content.Intent;
import com.facebook.react.ReactActivity;
import com.reactnativenavigation.NavigationActivity;

public class MainActivity extends NavigationActivity {

    /**
     * Returns the name of the main component registered from JavaScript.
     * This is used to schedule rendering of the component.
     */
//    @Override
//    protected String getMainComponentName() {
//        return "CityPrimeAndroid";
//    }
    @Override
    public void onActivityResult(int requestCode, int resultCode, Intent data) {
        super.onActivityResult(requestCode, resultCode, data);
        MainApplication.getCallbackManager().onActivityResult(requestCode, resultCode, data);
    }


}
