import { View } from "react-native";
import { Button, Text } from "react-native-paper";

function SuccessRegister(props) {
    return (
        <View>
            <Text 
            style={{ textAlign : "center",  width : "100%", color : "#22c55e", fontSize : 24, fontWeight : "bold", paddingVertical : 16}}>
                Thank You!, Your registration is Successful! Please Login to explore books
            </Text>
            <View style={{ width : "100%", display : "flex", justifyContent : "center", alignItems : "center" }}>
            <Button mode="contained" style={{ width: 300 }} onPress={() => props.navigation.navigate("Login")}>Login</Button>
            </View>
        </View>
    )
}

export default SuccessRegister;
