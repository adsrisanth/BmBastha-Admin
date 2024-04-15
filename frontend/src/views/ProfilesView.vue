<template>
  <div class="container mx-auto">
    <div class="flex justify-center items-center h-screen">
      <div class="w-full sm:w-10/12 md:w-8/12 lg:w-6/12 xl:w-4/12">
        <v-card class="elevation-6 mt-10">
          <v-window v-model="step">
            <v-window-item :value="1">
              <div class="flex flex-col md:flex-row">
                <div class="md:w-1/2 bg-blue-500 rounded-tl-xl md:rounded-bl-xl px-8 py-16 text-white">
                  <h3 class="text-center mb-8">Don't Have an Account Yet?</h3>
                  <h6 class="text-center mb-8">Let's get you all set up so you can start creating your first onboarding experience</h6>
                  <div class="text-center">
                    <v-btn outlined dark @click="step++">SIGN UP</v-btn>
                  </div>
                </div>
                <div class="md:w-1/2 px-8 py-10">
                  <h4 class="text-center mb-4">Login to Your Account</h4>
                  <h6 class="text-center text-gray-500 mb-8">Log in to your account so you can continue building and editing your onboarding flows</h6>
                  <v-row align="center" justify="center">
                    <v-col cols="12" sm="8">
                      <v-text-field label="Email" outlined dense color="blue" autocomplete="false" class="mt-4"></v-text-field>
                      <v-text-field label="Password" outlined dense color="blue" autocomplete="false" type="password"></v-text-field>
                      <v-row>
                        <v-col cols="12" sm="7">
                          <v-checkbox label="Remember Me" class="mt-n1" color="blue"></v-checkbox>
                        </v-col>
                        <v-col cols="12" sm="5">
                          <span class="caption blue--text ml-n4">Forgot password</span>
                        </v-col>
                      </v-row>
                      <v-btn color="blue" dark block tile>Log in</v-btn>
                      <h5 class="text-center text-gray-500 mt-4 mb-3">Or Log in using</h5>
                      <div class="d-flex justify-space-between align-center mx-10 mb-16">
                        <v-btn depressed outlined color="grey">
                          <v-icon color="red">fab fa-google</v-icon>
                        </v-btn>
                        <v-btn depressed outlined color="grey">
                          <v-icon color="blue">fab fa-facebook-f</v-icon>
                        </v-btn>
                        <v-btn depressed outlined color="grey">
                          <v-icon color="light-blue lighten-3">fab fa-twitter</v-icon>
                        </v-btn>
                      </div>
                    </v-col>
                  </v-row>
                </div>
              </div>
            </v-window-item>
            <v-window-item :value="2">
              <div class="flex flex-col md:flex-row">
                <div class="md:w-1/2 bg-blue-500 rounded-bl-xl md:rounded-tl-xl px-8 py-16 text-white">
                  <h3 class="text-center mb-8">Already Signed Up?</h3>
                  <h6 class="text-center mb-8">Log in to your account so you can continue building and editing your onboarding flows</h6>
                  <div class="text-center">
                    <v-btn outlined dark @click="step--">LOG IN</v-btn>
                  </div>
                </div>
                <div class="md:w-1/2 px-8 py-10">
                  <h4 class="text-center mb-4">Sign Up for an Account</h4>
                  <h6 class="text-center text-gray-500 mb-8">Let's get you all set up so you can start creating your first onboarding experience</h6>
                  <v-row align="center" justify="center">
                    <v-col cols="12" sm="8">
                      <v-text-field label="First Name" outlined dense color="blue" autocomplete="false" class="mt-4"></v-text-field>
                      <v-text-field label="Last Name" outlined dense color="blue" autocomplete="false" class="mt-4"></v-text-field>
                      <v-text-field label="Email" outlined dense color="blue" autocomplete="false"></v-text-field>
                      <v-text-field label="Password" outlined dense color="blue" autocomplete="false" type="password"></v-text-field>
                      <v-row>
                        <v-col cols="12" sm="7">
                          <v-checkbox label="I Accept AAE" class="mt-n1" color="blue"></v-checkbox>
                        </v-col>
                        <v-col cols="12" sm="5">
                          <span class="caption blue--text ml-n4">Terms & Conditions</span>
                        </v-col>
                      </v-row>
                      <v-btn color="blue" dark block tile>Sign up</v-btn>
                      <h5 class="text-center text-gray-500 mt-4 mb-3">Or Sign up using</h5>
                      <div class="d-flex justify-space-between align-center mx-10 mb-11">
                        <v-btn depressed outlined color="grey">
                          <v-icon color="red">fab fa-google</v-icon>
                        </v-btn>
                        <v-btn depressed outlined color="grey">
                          <v-icon color="blue">fab fa-facebook-f</v-icon>
                        </v-btn>
                        <v-btn depressed outlined color="grey">
                          <v-icon color="light-blue lighten-3">fab fa-twitter</v-icon>
                        </v-btn>
                      </div>
                    </v-col>
                  </v-row>
                </div>
              </div>
            </v-window-item>
          </v-window>
        </v-card>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      step: 1
    };
  }
};
</script>

<style scoped>
.v-application .rounded-tl-xl {
  border-top-left-radius: 1.5rem !important;
}
.v-application .rounded-bl-xl {
  border-bottom-left-radius: 1.5rem !important;
}
.v-application .rounded-tr-xl {
  border-top-right-radius: 1.5rem !important;
}
.v-application .rounded-br-xl {
  border-bottom-right-radius: 1.5rem !important;
}
</style>
