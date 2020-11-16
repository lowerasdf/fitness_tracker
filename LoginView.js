import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, TextInput, findNodeHandle, AccessibilityInfo, Keyboard, Alert } from 'react-native';
import base64 from 'base-64';

class LoginView extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      username: "",
      password: "",
      accessibilityModalUsername: false,
      accessibilityModalPassword: false,
      formHint: "",
      showingKeyboard: false
    }

    this.handleLogin = this.handleLogin.bind(this);
    this.handleSignup = this.handleSignup.bind(this);
    this.componentDidMount = this.componentDidMount.bind(this);
    this._keyboardDidHide = this._keyboardDidHide.bind(this);
    this.startFocus = React.createRef();
    this.usernameFocus = React.createRef();
    this.passwordFocus = React.createRef();
    this.onFocusHint = "Swipe right to access the keyboard. Once you’re done, you can make a two finger Z shaped gesture to exit the edit mode. To start or end dictation, double tap using two fingers";
    this._keyboardDidShow = this._keyboardDidShow.bind(this);
    this.escapeGestureHandler = this.escapeGestureHandler.bind(this);
    this.tabSub = null;
    this.moveSub = null;
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
      formHint: "",
    });
  }

  _keyboardDidShow() {
    this.setState({ showingKeyboard: true });
  }

  componentDidMount() {
    AccessibilityInfo.setAccessibilityFocus(findNodeHandle(this.startFocus.current));
    this.keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', this._keyboardDidHide);
    this.keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', this._keyboardDidShow);
    this.tabSub = this.props.navigation.addListener('tabPress', async e => {
      AccessibilityInfo.setAccessibilityFocus(findNodeHandle(this.startFocus.current));
    })
    this.moveSub = this.props.navigation.addListener('focus', async e => {
      AccessibilityInfo.setAccessibilityFocus(findNodeHandle(this.startFocus.current));
    })
  }

  componentWillUnmount() {
    this.keyboardDidHideListener.remove();
    this.keyboardDidShowListener.remove();
    this.tabSub();
    this.moveSub();
  }

  escapeGestureHandler() {
    if (this.state.showingKeyboard) {
      Keyboard.dismiss();
    } else {
      //TODO logout or close modal (not applicable here)
    }
  }

  /**
   * Logs in to the application.
   * 
   * Note that we have to follow the authorization rules; a header
   * with a base64-encoded username and password.
   * 
   * Upon response, we analyze whether or not we are successful.
   * If successful, we use a callback from App to log us in and
   * store the username and token in App.
   */
  handleLogin() {
    fetch('https://mysqlcs639.cs.wisc.edu/login', {
      method: 'GET',
      headers: {
        'Authorization': 'Basic ' + base64.encode(this.state.username + ":" + this.state.password)
      }
    })
      .then(res => res.json())
      .then(res => {
        if (res.token) {
          this.props.login(this.state.username, res.token);
        } else {
          Alert.alert(
            'Invalid Login',
            'Incorrect username or password! Please try again after clicking Ok button below.',
            [
              {
                text: 'Ok', onPress: () => {
                  AccessibilityInfo.setAccessibilityFocus(findNodeHandle(this.usernameFocus.current));
                }
              }
            ],
            { cancelable: false }
          );
        }
      });
  }

  /**
   * Use React Navigation to switch to the Sign Up page.
   */
  handleSignup() {
    this.props.navigation.navigate('SignUp');
  }

  /**
   * Displays and collects the login information.
   * 
   * The styling could definitely be cleaned up; should be consistent!
   */
  render() {
    return (
      <View style={styles.container}>
        <View accessible={true}
          style={{ alignItems: 'center', justifyContent: 'center' }}
          ref={this.startFocus}
          accessibilityLabel="Welcome to Fitness Tracker!"
          accessibilityHint="please fill in the username and password below, and login by double tapping the login button. Or, sign-up using the sign-up button"
        >
          <Text style={styles.bigText}>FitnessTracker</Text>
          <Text>Welcome! Please login or sign-up to continue.</Text>
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
          <TouchableOpacity style={styles.button} onPress={this.handleLogin} accessibilityHint="Double tap to login to the application" accessibilityRole="button">
            <Text style={styles.insideButton}>Login</Text>
          </TouchableOpacity>
          <View style={styles.spaceHorizontal} />
          <TouchableOpacity style={styles.button} onPress={this.handleSignup} accessibilityLabel="sign up" accessibilityHint="Double tap to get into the sign-up screen if you are a new user" accessibilityRole="button">
            <Text style={styles.insideButton}>Signup</Text>
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

export default LoginView;
