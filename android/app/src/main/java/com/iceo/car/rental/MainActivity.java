package com.zipenter.where;

// Add these required imports:
import android.os.Bundle;
import android.util.Log;

import androidx.annotation.Nullable;

import com.google.android.ump.ConsentDebugSettings;
import com.zoontek.rnbootsplash.RNBootSplash;

import com.facebook.react.ReactActivity;
import com.facebook.react.ReactActivityDelegate;
import com.facebook.react.defaults.DefaultNewArchitectureEntryPoint;
import com.facebook.react.defaults.DefaultReactActivityDelegate;

import com.google.android.ump.ConsentForm;
import com.google.android.ump.ConsentInformation;
import com.google.android.ump.ConsentRequestParameters;
import com.google.android.ump.FormError;
import com.google.android.ump.UserMessagingPlatform;

public class MainActivity extends ReactActivity {

  private ConsentInformation consentInformation;
  private ConsentForm consentForm;


  /**
   * Returns the name of the main component registered from JavaScript. This is used to schedule
   * rendering of the component.
   */
  @Override
  protected String getMainComponentName() {
    return "law_ai";
  }

  /**
   * Returns the instance of the {@link ReactActivityDelegate}. Here we use a util class {@link
   * DefaultReactActivityDelegate} which allows you to easily enable Fabric and Concurrent React
   * (aka React 18) with two boolean flags.
   */
  @Override
  protected ReactActivityDelegate createReactActivityDelegate() {
    return new DefaultReactActivityDelegate(
        this,
        getMainComponentName(),
        // If you opted-in for the New Architecture, we enable the Fabric Renderer.
        DefaultNewArchitectureEntryPoint.getFabricEnabled(), // fabricEnabled
        // If you opted-in for the New Architecture, we enable Concurrent React (i.e. React 18).
        DefaultNewArchitectureEntryPoint.getConcurrentReactEnabled() // concurrentRootEnabled
        );
  }

    public void loadForm() {
        UserMessagingPlatform.loadConsentForm(
                this, new UserMessagingPlatform.OnConsentFormLoadSuccessListener() {
                    @Override
                    public void onConsentFormLoadSuccess(ConsentForm consentForm) {
                        MainActivity.this.consentForm = consentForm;
                        Log.d("test", "2 abcd");
                        if (consentInformation.getConsentStatus() == ConsentInformation.ConsentStatus.REQUIRED) {
                            Log.d("test", "3 abcd");
                            consentForm.show(
                                    MainActivity.this,
                                    new ConsentForm.OnConsentFormDismissedListener() {
                                        @Override
                                        public void onConsentFormDismissed(@Nullable FormError formError) {
                                            // Handle dismissal by reloading form.
                                            loadForm();
                                            Log.d("test", "4 abcd");
                                        }
                                    });
                        }
                    }
                },
                new UserMessagingPlatform.OnConsentFormLoadFailureListener() {
                    @Override
                    public void onConsentFormLoadFailure(FormError formError) {
                        // Handle the error.
                    }
                });
    }


  @Override
  protected void onCreate(Bundle savedInstanceState) {
    RNBootSplash.init(this); // <- initialize the splash screen
    super.onCreate(null); // or super.onCreate(null) with react-native-screens

      // test device id
      ConsentDebugSettings debugSettings = new ConsentDebugSettings.Builder(this)
              .setDebugGeography(ConsentDebugSettings
                      .DebugGeography
                      .DEBUG_GEOGRAPHY_EEA)
              .addTestDeviceHashedId("D81D99D45B3600E1BD66B05386FEC210")
              .build();

    // Set tag for underage of consent. Here false means users are not underage.
    ConsentRequestParameters params = new ConsentRequestParameters
        .Builder()
        .setTagForUnderAgeOfConsent(false)
        .build();

    consentInformation = UserMessagingPlatform.getConsentInformation(this);
    consentInformation.requestConsentInfoUpdate(
        this,
        params,
        new ConsentInformation.OnConsentInfoUpdateSuccessListener() {
          @Override
          public void onConsentInfoUpdateSuccess() {
            // The consent information state was updated.
            // You are now ready to check if a form is available.
            if (consentInformation.isConsentFormAvailable()) {
                Log.d("test", "1 abcd");
              loadForm();
            }
          }
        },
        new ConsentInformation.OnConsentInfoUpdateFailureListener() {
          @Override
          public void onConsentInfoUpdateFailure(FormError formError) {
            // Handle the error.
              Log.d("test error", "1 abcd error: " + formError.getMessage());
          }
        });

  }
}
