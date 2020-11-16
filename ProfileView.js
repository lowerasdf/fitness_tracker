import React from 'react';
import { StyleSheet, Text, View, Alert, TextInput, ScrollView, KeyboardAvoidingView, AccessibilityInfo, findNodeHandle, Keyboard } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { Dimensions, TouchableOpacity } from 'react-native';

class ProfileView extends React.Component {

  /**
   * Specifies the default values that will be shown for a split second
   * while data is loading in from the server.
   */
  constructor(props) {
    super(props);
    this.state = {
      firstName: "",
      lastName: "",
      goalDailyCalories: 0.0,
      goalDailyProtein: 0.0,
      goalDailyCarbohydrates: 0.0,
      goalDailyFat: 0.0,
      goalDailyActivity: 0.0,
      accessibilityModalFirstName: false,
      accessibilityModalLastName: false,
      accessibilityModalCalories: false,
      accessibilityModalProtein: false,
      accessibilityModalCarbs: false,
      accessibilityModalFat: false,
      accessibilityModalActivity: false,
      formHint: "",
      showingKeyboard: false
    }
    this.startFocus = React.createRef();
    this.componentDidMount = this.componentDidMount.bind(this);
    this.tabSub = null;
    this.moveSub = null;
    this.firstNameFocus = React.createRef();
    this.lastNameFocus = React.createRef();
    this.caloriesFocus = React.createRef();
    this.proteinFocus = React.createRef();
    this.carbsFocus = React.createRef();
    this.fatFocus = React.createRef();
    this.activityFocus = React.createRef();
    this._keyboardDidHide = this._keyboardDidHide.bind(this);
    this.onFocusHint = "Swipe right to access the keyboard. Once you’re done, you can make a two finger Z shaped gesture to exit the edit mode. To start or end dictation, double tap using two fingers";
    this.onFocusHintNumeric = "Please only enter numbers. Swipe right to access the keyboard. Once you’re done, you can make a two finger Z shaped gesture to exit the edit mode. To start or end dictation, double tap using two fingers";
    this._keyboardDidShow = this._keyboardDidShow.bind(this);
    this.escapeGestureHandler = this.escapeGestureHandler.bind(this);
  }

  _keyboardDidHide() {
    if (this.state.accessibilityModalFirstName) {
      AccessibilityInfo.setAccessibilityFocus(findNodeHandle(this.firstNameFocus.current));
    } else if (this.state.accessibilityModalLastName) {
      AccessibilityInfo.setAccessibilityFocus(findNodeHandle(this.lastNameFocus.current));
    } else if (this.state.accessibilityModalCalories) {
      AccessibilityInfo.setAccessibilityFocus(findNodeHandle(this.caloriesFocus.current));
    } else if (this.state.accessibilityModalProtein) {
      AccessibilityInfo.setAccessibilityFocus(findNodeHandle(this.proteinFocus.current));
    } else if (this.state.accessibilityModalCarbs) {
      AccessibilityInfo.setAccessibilityFocus(findNodeHandle(this.carbsFocus.current));
    } else if (this.state.accessibilityModalFat) {
      AccessibilityInfo.setAccessibilityFocus(findNodeHandle(this.fatFocus.current));
    } else if (this.state.accessibilityModalActivity) {
      AccessibilityInfo.setAccessibilityFocus(findNodeHandle(this.activityFocus.current));
    }
    this.setState({
      accessibilityModalFirstName: false,
      accessibilityModalLastName: false,
      accessibilityModalCalories: false,
      accessibilityModalProtein: false,
      accessibilityModalCarbs: false,
      accessibilityModalFat: false,
      accessibilityModalActivity: false,
      showingKeyboard: false,
      formHint: "",
    });
  }

  _keyboardDidShow() {
    this.setState({ showingKeyboard: true });
  }

  /**
   * Fetch the data from the API after mounting; this may take a few seconds.
   * Once the data is fetched, it is stored into the state and then displayed
   * onto the fields.
   * 
   * This GET request requires us to specify our username and x-access-token,
   * both of which we inherit through props.
   */
  componentDidMount() {
    fetch('https://mysqlcs639.cs.wisc.edu/users/' + this.props.username, {
      method: 'GET',
      headers: { 'x-access-token': this.props.accessToken }
    })
      .then(res => res.json())
      .then(res => {
        this.setState({
          firstName: res.firstName,
          lastName: res.lastName,
          goalDailyCalories: res.goalDailyCalories,
          goalDailyProtein: res.goalDailyProtein,
          goalDailyCarbohydrates: res.goalDailyCarbohydrates,
          goalDailyFat: res.goalDailyFat,
          goalDailyActivity: res.goalDailyActivity
        });
      });

    let reactTag = findNodeHandle(this.startFocus.current);
    if (reactTag) {
      AccessibilityInfo.setAccessibilityFocus(reactTag);
      AccessibilityInfo.setAccessibilityFocus(reactTag);
      AccessibilityInfo.setAccessibilityFocus(reactTag);
      AccessibilityInfo.setAccessibilityFocus(reactTag);
    }
    this.tabSub = this.props.navigation.addListener('tabPress', async e => {
      AccessibilityInfo.setAccessibilityFocus(findNodeHandle(this.startFocus.current));
    })
    this.moveSub = this.props.navigation.addListener('focus', async e => {
      AccessibilityInfo.setAccessibilityFocus(findNodeHandle(this.startFocus.current));
    })
    this.keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', this._keyboardDidHide);
    this.keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', this._keyboardDidShow);
  }

  componentWillUnmount() {
    this.tabSub();
    this.moveSub();
    this.keyboardDidHideListener.remove();
    this.keyboardDidShowListener.remove();
  }

  parseInput(input) {
    let retVal = parseFloat(input);
    if (isNaN(retVal)) {
      return 0
    }
    return retVal
  }

  escapeGestureHandler() {
    if (this.state.showingKeyboard) {
      Keyboard.dismiss();
    } else {
      this.props.logoutConfirmation();
    }
  }

  /**
   * Displays and collects the profile information.
   * 
   * The styling could definitely be cleaned up; should be consistent!
   */
  render() {
    return (
      <KeyboardAvoidingView style={{ flex: 1 }} behavior="padding" keyboardVerticalOffset={-50}>
        <ScrollView style={styles.mainContainer} contentContainerStyle={{ flexGrow: 11, justifyContent: 'center', alignItems: "center" }}>
          <View style={styles.space} />
          <View style={{ justifyContent: "center", alignItems: "center" }}
            accessible={true}
            accessibilityLabel="You’re at the Profile View. Let's get to know you!"
            accessibilityHint="specify your information below. To jump over to Today's view, double tap with two fingers. To logout, make a two finger Z shaped gesture."
            accessibilityActions={[
              { name: 'magicTap', label: 'magicTap' },
              { name: 'escape', label: 'escape' }
            ]}
            onAccessibilityAction={(event) => {
              switch (event.nativeEvent.actionName) {
                case 'magicTap':
                  this.props.navigation.navigate("Today");
                  AccessibilityInfo.announceForAccessibility("Jump to: Today View");
                  break;
                case 'escape':
                  this.escapeGestureHandler();
                  break;
              }
            }}
            ref={this.startFocus}>
            <View style={styles.space} />
            <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
              <Icon name="male" size={40} color="#5e60ce" style={{ marginRight: 20 }} />
              <Text style={styles.bigText}>About Me</Text>
            </View>
            <Text>Let's get to know you!</Text>
            <Text>Specify your information below.</Text>
          </View>
          <View style={styles.space} />
          <View accessible={true}
            accessibilityActions={[
              { name: 'magicTap', label: 'magicTap' },
              { name: 'escape', label: 'escape' }
            ]}
            onAccessibilityAction={(event) => {
              switch (event.nativeEvent.actionName) {
                case 'magicTap':
                  this.props.navigation.navigate("Today");
                  AccessibilityInfo.announceForAccessibility("Jump to: Today View");
                  break;
                case 'escape':
                  this.escapeGestureHandler();
                  break;
              }
            }}>
            <Text style={{ textAlignVertical: "center", fontWeight: "700", fontSize: 20 }}>Personal Information</Text>
          </View>
          <View style={styles.spaceSmall}></View>
          <View accessible={true}
            accessibilityActions={[
              { name: 'magicTap', label: 'magicTap' },
              { name: 'escape', label: 'escape' }
            ]}
            onAccessibilityAction={(event) => {
              switch (event.nativeEvent.actionName) {
                case 'magicTap':
                  this.props.navigation.navigate("Today");
                  AccessibilityInfo.announceForAccessibility("Jump to: Today View");
                  break;
                case 'escape':
                  this.escapeGestureHandler();
                  break;
              }
            }}>
            <Text style={{ textAlignVertical: "center", fontWeight: "700" }}>First Name</Text>
          </View>
          <View accessibilityViewIsModal={this.state.accessibilityModalFirstName}
            onAccessibilityEscape={() => this.escapeGestureHandler()}
            accessibilityActions={[
              { name: 'magicTap', label: 'magicTap' },
              { name: 'escape', label: 'escape' }
            ]}
            onAccessibilityAction={(event) => {
              switch (event.nativeEvent.actionName) {
                case 'magicTap':
                  this.props.navigation.navigate("Today");
                  AccessibilityInfo.announceForAccessibility("Jump to: Today View");
                  break;
                case 'escape':
                  this.escapeGestureHandler();
                  break;
              }
            }} >
            <TextInput style={styles.input}
              underlineColorAndroid="transparent"
              placeholder="for example, Bucky"
              placeholderTextColor="#d9bebd"
              onChangeText={(firstName) => this.setState({ firstName: firstName })}
              value={this.state.firstName}
              autoCapitalize="none"
              accessibilityLabel="Enter your first name here!"
              accessibilityHint={this.state.formHint}
              ref={this.firstNameFocus}
              onFocus={() => this.setState({
                accessibilityModalFirstName: true,
                formHint: this.onFocusHint
              })} />
          </View>
          <View style={styles.spaceSmall}></View>
          <View accessible={true}
            accessibilityActions={[
              { name: 'magicTap', label: 'magicTap' },
              { name: 'escape', label: 'escape' }
            ]}
            onAccessibilityAction={(event) => {
              switch (event.nativeEvent.actionName) {
                case 'magicTap':
                  this.props.navigation.navigate("Today");
                  AccessibilityInfo.announceForAccessibility("Jump to: Today View");
                  break;
                case 'escape':
                  this.escapeGestureHandler();
                  break;
              }
            }}>
            <Text style={{ textAlignVertical: "center", fontWeight: "700" }}>Last Name</Text>
          </View>
          <View accessibilityViewIsModal={this.state.accessibilityModalLastName}
            onAccessibilityEscape={() => this.escapeGestureHandler()}
            accessibilityActions={[
              { name: 'magicTap', label: 'magicTap' },
              { name: 'escape', label: 'escape' }
            ]}
            onAccessibilityAction={(event) => {
              switch (event.nativeEvent.actionName) {
                case 'magicTap':
                  this.props.navigation.navigate("Today");
                  AccessibilityInfo.announceForAccessibility("Jump to: Today View");
                  break;
                case 'escape':
                  this.escapeGestureHandler();
                  break;
              }
            }} >
            <TextInput style={styles.input}
              underlineColorAndroid="transparent"
              placeholder="for example, Badger"
              placeholderTextColor="#d9bebd"
              onChangeText={(lastName) => this.setState({ lastName: lastName })}
              value={this.state.lastName}
              autoCapitalize="none"
              accessibilityLabel="Enter your last name here!"
              accessibilityHint={this.state.formHint}
              ref={this.lastNameFocus}
              onFocus={() => this.setState({
                accessibilityModalLastName: true,
                formHint: this.onFocusHint
              })} />
          </View>
          <View style={styles.spaceSmall}></View>

          <View accessible={true}
            accessibilityActions={[
              { name: 'magicTap', label: 'magicTap' },
              { name: 'escape', label: 'escape' }
            ]}
            onAccessibilityAction={(event) => {
              switch (event.nativeEvent.actionName) {
                case 'magicTap':
                  this.props.navigation.navigate("Today");
                  AccessibilityInfo.announceForAccessibility("Jump to: Today View");
                  break;
                case 'escape':
                  this.escapeGestureHandler();
                  break;
              }
            }}>
            <Text style={{ textAlignVertical: "center", fontWeight: "700", fontSize: 20 }}>Fitness Goals</Text>
          </View>
          <View style={styles.spaceSmall}></View>
          <View accessible={true}
            accessibilityActions={[
              { name: 'magicTap', label: 'magicTap' },
              { name: 'escape', label: 'escape' }
            ]}
            onAccessibilityAction={(event) => {
              switch (event.nativeEvent.actionName) {
                case 'magicTap':
                  this.props.navigation.navigate("Today");
                  AccessibilityInfo.announceForAccessibility("Jump to: Today View");
                  break;
                case 'escape':
                  this.escapeGestureHandler();
                  break;
              }
            }}>
            <Text style={{ textAlignVertical: "center", fontWeight: "700" }}>Daily Calories (kcal)</Text>
          </View>
          <View accessibilityViewIsModal={this.state.accessibilityModalCalories}
            onAccessibilityEscape={() => this.escapeGestureHandler()}
            accessibilityActions={[
              { name: 'magicTap', label: 'magicTap' },
              { name: 'escape', label: 'escape' }
            ]}
            onAccessibilityAction={(event) => {
              switch (event.nativeEvent.actionName) {
                case 'magicTap':
                  this.props.navigation.navigate("Today");
                  AccessibilityInfo.announceForAccessibility("Jump to: Today View");
                  break;
                case 'escape':
                  this.escapeGestureHandler();
                  break;
              }
            }} >
            <TextInput style={styles.input}
              keyboardType='numbers-and-punctuation'
              underlineColorAndroid="transparent"
              placeholder="for example, 2200"
              placeholderTextColor="#d9bebd"
              onChangeText={(goalDailyCalories) => this.setState({ goalDailyCalories: goalDailyCalories })}
              value={this.state.goalDailyCalories + ""}
              autoCapitalize="none"
              accessibilityLabel="Enter your daily calories goal here!"
              accessibilityHint={this.state.formHint}
              ref={this.caloriesFocus}
              onFocus={() => this.setState({
                accessibilityModalCalories: true,
                formHint: this.onFocusHintNumeric
              })} />
          </View>
          <View style={styles.spaceSmall}></View>
          <View accessible={true}
            accessibilityActions={[
              { name: 'magicTap', label: 'magicTap' },
              { name: 'escape', label: 'escape' }
            ]}
            onAccessibilityAction={(event) => {
              switch (event.nativeEvent.actionName) {
                case 'magicTap':
                  this.props.navigation.navigate("Today");
                  AccessibilityInfo.announceForAccessibility("Jump to: Today View");
                  break;
                case 'escape':
                  this.escapeGestureHandler();
                  break;
              }
            }}>
            <Text style={{ textAlignVertical: "center", fontWeight: "700" }}>Daily Protein (grams)</Text>
          </View>
          <View accessibilityViewIsModal={this.state.accessibilityModalProtein}
            onAccessibilityEscape={() => this.escapeGestureHandler()}
            accessibilityActions={[
              { name: 'magicTap', label: 'magicTap' },
              { name: 'escape', label: 'escape' }
            ]}
            onAccessibilityAction={(event) => {
              switch (event.nativeEvent.actionName) {
                case 'magicTap':
                  this.props.navigation.navigate("Today");
                  AccessibilityInfo.announceForAccessibility("Jump to: Today View");
                  break;
                case 'escape':
                  this.escapeGestureHandler();
                  break;
              }
            }} >
            <TextInput style={styles.input}
              keyboardType='numbers-and-punctuation'
              underlineColorAndroid="transparent"
              placeholder="for example, 52"
              placeholderTextColor="#d9bebd"
              onChangeText={(goalDailyProtein) => this.setState({ goalDailyProtein: goalDailyProtein })}
              value={this.state.goalDailyProtein + ""}
              autoCapitalize="none"
              accessibilityLabel="Enter your daily protein goal here!"
              accessibilityHint={this.state.formHint}
              ref={this.proteinFocus}
              onFocus={() => this.setState({
                accessibilityModalProtein: true,
                formHint: this.onFocusHintNumeric
              })} />
          </View>
          <View style={styles.spaceSmall}></View>
          <View accessible={true}
            accessibilityActions={[
              { name: 'magicTap', label: 'magicTap' },
              { name: 'escape', label: 'escape' }
            ]}
            onAccessibilityAction={(event) => {
              switch (event.nativeEvent.actionName) {
                case 'magicTap':
                  this.props.navigation.navigate("Today");
                  AccessibilityInfo.announceForAccessibility("Jump to: Today View");
                  break;
                case 'escape':
                  this.escapeGestureHandler();
                  break;
              }
            }}>
            <Text style={{ textAlignVertical: "center", fontWeight: "700" }}>Daily Carbs (grams)</Text>
          </View>
          <View accessibilityViewIsModal={this.state.accessibilityModalCarbs}
            onAccessibilityEscape={() => this.escapeGestureHandler()}
            accessibilityActions={[
              { name: 'magicTap', label: 'magicTap' },
              { name: 'escape', label: 'escape' }
            ]}
            onAccessibilityAction={(event) => {
              switch (event.nativeEvent.actionName) {
                case 'magicTap':
                  this.props.navigation.navigate("Today");
                  AccessibilityInfo.announceForAccessibility("Jump to: Today View");
                  break;
                case 'escape':
                  this.escapeGestureHandler();
                  break;
              }
            }} >
            <TextInput style={styles.input}
              keyboardType='numbers-and-punctuation'
              underlineColorAndroid="transparent"
              placeholder="for example, 130"
              placeholderTextColor="#d9bebd"
              onChangeText={(goalDailyCarbohydrates) => this.setState({ goalDailyCarbohydrates: goalDailyCarbohydrates })}
              value={this.state.goalDailyCarbohydrates + ""}
              autoCapitalize="none"
              accessibilityLabel="Enter your daily carbohydrates goal here!"
              accessibilityHint={this.state.formHint}
              ref={this.carbsFocus}
              onFocus={() => this.setState({
                accessibilityModalCarbs: true,
                formHint: this.onFocusHintNumeric
              })} />
          </View>
          <View style={styles.spaceSmall}></View>
          <View accessible={true}
            accessibilityActions={[
              { name: 'magicTap', label: 'magicTap' },
              { name: 'escape', label: 'escape' }
            ]}
            onAccessibilityAction={(event) => {
              switch (event.nativeEvent.actionName) {
                case 'magicTap':
                  this.props.navigation.navigate("Today");
                  AccessibilityInfo.announceForAccessibility("Jump to: Today View");
                  break;
                case 'escape':
                  this.escapeGestureHandler();
                  break;
              }
            }}>
            <Text style={{ textAlignVertical: "center", fontWeight: "700" }}>Daily Fat (grams)</Text>
          </View>
          <View accessibilityViewIsModal={this.state.accessibilityModalFat}
            onAccessibilityEscape={() => this.escapeGestureHandler()}
            accessibilityActions={[
              { name: 'magicTap', label: 'magicTap' },
              { name: 'escape', label: 'escape' }
            ]}
            onAccessibilityAction={(event) => {
              switch (event.nativeEvent.actionName) {
                case 'magicTap':
                  this.props.navigation.navigate("Today");
                  AccessibilityInfo.announceForAccessibility("Jump to: Today View");
                  break;
                case 'escape':
                  this.escapeGestureHandler();
                  break;
              }
            }} >
            <TextInput style={styles.input}
              keyboardType='numbers-and-punctuation'
              underlineColorAndroid="transparent"
              placeholder="for example, 35"
              placeholderTextColor="#d9bebd"
              onChangeText={(goalDailyFat) => this.setState({ goalDailyFat: goalDailyFat })}
              value={this.state.goalDailyFat + ""}
              autoCapitalize="none"
              accessibilityLabel="Enter your daily fat goal here!"
              accessibilityHint={this.state.formHint}
              ref={this.fatFocus}
              onFocus={() => this.setState({
                accessibilityModalFat: true,
                formHint: this.onFocusHintNumeric
              })} />
          </View>
          <View style={styles.spaceSmall}></View>
          <View accessible={true}
            accessibilityActions={[
              { name: 'magicTap', label: 'magicTap' },
              { name: 'escape', label: 'escape' }
            ]}
            onAccessibilityAction={(event) => {
              switch (event.nativeEvent.actionName) {
                case 'magicTap':
                  this.props.navigation.navigate("Today");
                  AccessibilityInfo.announceForAccessibility("Jump to: Today View");
                  break;
                case 'escape':
                  this.escapeGestureHandler();
                  break;
              }
            }}>
            <Text style={{ textAlignVertical: "center", fontWeight: "700" }}>Daily Activity (mins)</Text>
          </View>
          <View accessibilityViewIsModal={this.state.accessibilityModalActivity}
            onAccessibilityEscape={() => this.escapeGestureHandler()}
            accessibilityActions={[
              { name: 'magicTap', label: 'magicTap' },
              { name: 'escape', label: 'escape' }
            ]}
            onAccessibilityAction={(event) => {
              switch (event.nativeEvent.actionName) {
                case 'magicTap':
                  this.props.navigation.navigate("Today");
                  AccessibilityInfo.announceForAccessibility("Jump to: Today View");
                  break;
                case 'escape':
                  this.escapeGestureHandler();
                  break;
              }
            }} >
            <TextInput style={styles.input}
              keyboardType='numbers-and-punctuation'
              underlineColorAndroid="transparent"
              placeholder="for example, 60"
              placeholderTextColor="#d9bebd"
              onChangeText={(goalDailyActivity) => this.setState({ goalDailyActivity: goalDailyActivity })}
              value={this.state.goalDailyActivity + ""}
              autoCapitalize="none"
              accessibilityLabel="Enter your daily activity goal here!"
              accessibilityHint={this.state.formHint}
              ref={this.activityFocus}
              onFocus={() => this.setState({
                accessibilityModalActivity: true,
                formHint: this.onFocusHintNumeric
              })} />
          </View>
          <View style={styles.spaceSmall}></View>

          <View style={styles.space} />

          <Text style={{ fontWeight: "700", fontSize: 20 }}>Looks good! All set?</Text>
          <View style={styles.spaceSmall} />

          <View style={{ flexDirection: 'row', flexWrap: 'wrap' }} accessible={true} accessibilityHint="double tap to save profile" accessibilityRole="button">
            <TouchableOpacity style={styles.button} onPress={() => this.handleSaveProfile()}>
              <Text style={styles.insideButton}>Save Profile</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.space} />
        </ScrollView>
      </KeyboardAvoidingView>
    );
  }

  /**
   * Make a PUT request to save all the entered information onto the server.
   * Note, we must check if what the user entered is a number. Once the state
   * is guarnteed to be set, we call the fetch function.
   * 
   * This PUT request requires us to specify our username and x-access-token,
   * both of which we inherit through props. Additionally, we are sending a
   * JSON body, so we need to specify Content-Type: application/json
   */
  handleSaveProfile() {
    if (isNaN(parseFloat(this.state.goalDailyCalories)) && this.state.goalDailyCalories !== "") {
      Alert.alert(
        "Invalid Entry",
        "Make sure that you only entered numbers in the daily calories goal. Press ok below to continue.",
        [
          {
            text: "OK", onPress: () => {
              let reactTag = findNodeHandle(this.caloriesFocus.current);
              if (reactTag) {
                AccessibilityInfo.setAccessibilityFocus(reactTag);
              }
            }
          }
        ],
        { cancelable: false }
      );
      return;
    }
    if (isNaN(parseFloat(this.state.goalDailyCarbohydrates)) && this.state.goalDailyCarbohydrates !== "") {
      Alert.alert(
        "Invalid Entry",
        "Make sure that you only entered numbers in the daily carbohydrates goal. Press ok below to continue.",
        [
          {
            text: "OK", onPress: () => {
              let reactTag = findNodeHandle(this.carbsFocus.current);
              if (reactTag) {
                AccessibilityInfo.setAccessibilityFocus(reactTag);
              }
            }
          }
        ],
        { cancelable: false }
      );
      return;
    }
    if (isNaN(parseFloat(this.state.goalDailyProtein)) && this.state.goalDailyProtein !== "") {
      Alert.alert(
        "Invalid Entry",
        "Make sure that you only entered numbers in the daily protein goal. Press ok below to continue.",
        [
          {
            text: "OK", onPress: () => {
              let reactTag = findNodeHandle(this.proteinFocus.current);
              if (reactTag) {
                AccessibilityInfo.setAccessibilityFocus(reactTag);
              }
            }
          }
        ],
        { cancelable: false }
      );
      return;
    }
    if (isNaN(parseFloat(this.state.goalDailyFat)) && this.state.goalDailyFat !== "") {
      Alert.alert(
        "Invalid Entry",
        "Make sure that you only entered numbers in the daily fat goal. Press ok below to continue.",
        [
          {
            text: "OK", onPress: () => {
              let reactTag = findNodeHandle(this.fatFocus.current);
              if (reactTag) {
                AccessibilityInfo.setAccessibilityFocus(reactTag);
              }
            }
          }
        ],
        { cancelable: false }
      );
      return;
    }
    if (isNaN(parseFloat(this.state.goalDailyActivity)) && this.state.goalDailyActivity !== "") {
      Alert.alert(
        "Invalid Entry",
        "Make sure that you only entered numbers in the daily activity goal. Press ok below to continue.",
        [
          {
            text: "OK", onPress: () => {
              let reactTag = findNodeHandle(this.activityFocus.current);
              if (reactTag) {
                AccessibilityInfo.setAccessibilityFocus(reactTag);
              }
            }
          }
        ],
        { cancelable: false }
      );
      return;
    }
    this.setState({
      goalDailyCalories: this.parseInput(this.state.goalDailyCalories),
      goalDailyProtein: this.parseInput(this.state.goalDailyProtein),
      goalDailyCarbohydrates: this.parseInput(this.state.goalDailyCarbohydrates),
      goalDailyFat: this.parseInput(this.state.goalDailyFat),
      goalDailyActivity: this.parseInput(this.state.goalDailyActivity)
    }, () => fetch('https://mysqlcs639.cs.wisc.edu/users/' + this.props.username, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'x-access-token': this.props.accessToken
      },
      body: JSON.stringify({
        firstName: this.state.firstName,
        lastName: this.state.lastName,
        goalDailyCalories: this.state.goalDailyCalories,
        goalDailyProtein: this.state.goalDailyProtein,
        goalDailyCarbohydrates: this.state.goalDailyCarbohydrates,
        goalDailyFat: this.state.goalDailyFat,
        goalDailyActivity: this.state.goalDailyActivity
      })
    })
      .then(res => res.json())
      .then(res => {
        if (res.message === "Token is invalid!") {
          Alert.alert(
            "Request Timeout",
            "Please re-login to continue.",
            [
              {
                text: "OK", onPress: () => this.props.revokeAccessToken()
              }
            ],
            { cancelable: false }
          );
        } else {
          Alert.alert(
            "Save Profile Success",
            "Your profile has been saved. Press ok below to continue.",
            [
              {
                text: "OK", onPress: () => {
                  let reactTag = findNodeHandle(this.startFocus.current);
                  if (reactTag) {
                    AccessibilityInfo.setAccessibilityFocus(reactTag);
                  }
                }
              }
            ],
            { cancelable: false }
          );
          this.props.changeGoal(this.state.firstName, this.state.lastName, this.state.goalDailyCalories, this.state.goalDailyProtein, this.state.goalDailyCarbohydrates, this.state.goalDailyFat, this.state.goalDailyActivity)
        }
      })
      .catch(err => {
        alert("Something went wrong! Verify you have filled out the fields correctly.");
      }));

  }

  backToLogin() {
    this.props.revokeAccessToken();
  }
}

const styles = StyleSheet.create({
  scrollView: {
    height: Dimensions.get('window').height
  },
  mainContainer: {
    flex: 1
  },
  scrollViewContainer: {},
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  bigText: {
    fontSize: 32,
    fontWeight: "700",
    marginBottom: 5
  },
  spaceSmall: {
    width: 20,
    height: 10,
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
  inputInline: {
    flexDirection: "row",
    display: "flex",
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

export default ProfileView;
