import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, TextInput, findNodeHandle, AccessibilityInfo, Keyboard, Alert } from 'react-native';

class SignupView extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      username: "",
      password: "",
      accessibilityModalUsername: false,
      accessibilityModalPassword: false,
      formHint: "Please provide at least 5 characters",
      showingKeyboard: false
    }

    this.handleCreateAccount = this.handleCreateAccount.bind(this);
    this.backToLogin = this.backToLogin.bind(this);
    this.componentDidMount = this.componentDidMount.bind(this);
    this._keyboardDidHide = this._keyboardDidHide.bind(this);
    this.startFocus = React.createRef();
    this.usernameFocus = React.createRef();
    this.passwordFocus = React.createRef();
    this.onFocusHint = "Swipe right to access the keyboard. Once you’re done, you can make a two finger Z shaped gesture to exit the edit mode. To start or end dictation, double tap using two fingers";
    this._keyboardDidShow = this._keyboardDidShow.bind(this);
    this.escapeGestureHandler = this.escapeGestureHandler.bind(this);
  }

  _keyboardDidHide() {
    if (this.state.accessibilityModalUsername) {
      AccessibilityInfo.setAccessibilityFocus(findNodeHandle(this.usernameFocus.current));
    } else {
      AccessibilityInfo.setAccessibilityFocus(findNodeHandle(this.passwordFocus.current));
    }
    this.setState({
      accessibilityModalUsername: false,
      accessibilityModalPassword: false,
      showingKeyboard: false,
      formHint: "Please provide at least 5 characters",
    });
  }

  _keyboardDidShow() {
    this.setState({ showingKeyboard: true });
  }

  componentDidMount() {
    AccessibilityInfo.setAccessibilityFocus(findNodeHandle(this.startFocus.current));
    this.keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', this._keyboardDidHide);
    this.keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', this._keyboardDidShow);
  }

  componentWillUnmount() {
    this.keyboardDidHideListener.remove();
    this.keyboardDidShowListener.remove();
  }

  escapeGestureHandler() {
    if (this.state.showingKeyboard) {
      Keyboard.dismiss();
    } else {
      this.props.navigation.navigate("SignIn");
    }
  }

  /**
   * Make a POST request to create a new user with the entered information.
   * 
   * This POST request requires us to specify a requested username and password,
   * Additionally, we are sending a JSON body, so we need to specify
   * Content-Type: application/json
   * 
   * Note that we very cheaply check if the responded message is what we expect,
   * otherwise we display what we get back from the server. A more sophisticated
   * implementation would check the status code and give custom error messages
   * based on the response.
   */
  handleCreateAccount() {
    fetch('https://mysqlcs639.cs.wisc.edu/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username: this.state.username,
        password: this.state.password,
      })
    })
      .then(res => res.json())
      .then(res => {
        if (res.message === "User created!") {
          alert(JSON.stringify(res.message));
          this.props.navigation.navigate("SignIn");
        } else {
          let msg = JSON.stringify(res.message).slice(1, -1);
          Alert.alert(
            'Sign-Up Failed',
            msg + ' Please try again after clicking Ok button below.',
            [
              {
                text: 'Ok', onPress:() => {
                  if(msg === "Field password must be 5 characters or longer.") {
                    AccessibilityInfo.setAccessibilityFocus(findNodeHandle(this.passwordFocus.current));
                  } else {
                    let reactTag = findNodeHandle(this.usernameFocus.current);
                    if(reactTag){
                      AccessibilityInfo.setAccessibilityFocus(reactTag);
                    }
                  }
                }
              }
            ],
            { cancelable: false }
          );
        }
      });
  }

  /**
   * Use React Navigation to switch to the Log In page.
   */
  backToLogin() {
    this.props.navigation.navigate("SignIn");
  }

  /**
   * Displays and collects the sign up information.
   * 
   * The styling could definitely be cleaned up; should be consistent!
   */
  render() {
    return (
      <View style={styles.container}>
        <View accessible={true}
          style={{ alignItems: 'center', justifyContent: 'center' }}
          ref={this.startFocus}
          accessibilityLabel="New to Fitness Tracker? Let's get started!"
          accessibilityHint="please fill in the username and password below, and sign up by double tapping the sign up button. If you already have an account, please double tap on the Nevermind button to get you back into the login screen"
        >
          <Text style={styles.bigText}>FitnessTracker</Text>
          <Text>New here? Let's get started!</Text>
          <Text>Please create an account below.</Text>
        </View>
        <View style={styles.space} />
        <View accessibilityViewIsModal={this.state.accessibilityModalUsername}
          onAccessibilityEscape={() => this.escapeGestureHandler()} >
          <TextInput style={styles.input}
            underlineColorAndroid="transparent"
            placeholder="Username"
            placeholderTextColor="#992a20"
            onChangeText={(username) => this.setState({ username: username })}
            value={this.state.username}
            autoCapitalize="none"
            accessibilityLabel="Enter your username here!"
            accessibilityHint={this.state.formHint}
            ref={this.usernameFocus}
            onFocus={() => this.setState({
              accessibilityModalUsername: true,
              formHint: this.onFocusHint
            })}
          />
        </View>
        <View accessibilityViewIsModal={this.state.accessibilityModalPassword}
          onAccessibilityEscape={() => this.escapeGestureHandler()}>
          <TextInput style={styles.input}
            secureTextEntry={true}
            underlineColorAndroid="transparent"
            placeholder="Password"
            placeholderTextColor="#992a20"
            onChangeText={(password) => this.setState({ password: password })}
            value={this.state.password}
            autoCapitalize="none"
            accessibilityLabel="Enter your password here!"
            accessibilityHint={this.state.formHint}
            ref={this.passwordFocus}
            onFocus={() => this.setState({
              accessibilityModalPassword: true,
              formHint: this.onFocusHint
            })} />
        </View>
        <View style={styles.space} />
        <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
          <TouchableOpacity style={styles.button} onPress={this.handleCreateAccount} accessibilityHint="Double tap to create an account" accessibilityRole="button">
            <Text style={styles.insideButton}>Create Account</Text>
          </TouchableOpacity>
          <View style={styles.spaceHorizontal} />
          <TouchableOpacity style={styles.button} onPress={this.backToLogin} accessibilityLabel="Nevermind!" accessibilityRole="button" accessibilityHint="Double tap to get back into the login screen">
            <Text style={styles.insideButton}>Nevermind!</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  bigText: {
    fontSize: 32,
    fontWeight: "700",
    marginBottom: 5
  },
  space: {
    width: 20,
    height: 20,
  },
  spaceHorizontal: {
    display: "flex",
    width: 20
  },
  buttonInline: {
    display: "flex"
  },
  input: {
    width: 200,
    padding: 10,
    margin: 5,
    height: 40,
    borderColor: '#c9392c',
    borderWidth: 1
  },
  button: {
    alignItems: "center",
    backgroundColor: "#5390d9",
    padding: 10,
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  insideButton: {
    fontSize: 15,
    color: "white",
  },
});

export default SignupView;
