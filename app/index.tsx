import { FC, useState } from "react";
import { Pressable, View } from "react-native";

export default function Index() {
  const tab = new Array(20).fill(0).map(() => new Array(20).fill(0));
  const [state, setState] = useState(tab);

  const handlePress = (index1: number, index2: number, value: number) => {
    let newTab = state.slice();
    newTab[index1][index2] = value === 1 ? 0 : 1;
    setState(newTab);
  }

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {
        state.map((t, index1) =>
          <View style={
            {
              display: 'flex',
              flexDirection: "row",
            }
          }>
            {
              t.map((value, index2) =>
                <Box index1={index1} index2={index2} value={value} handlePress={handlePress} />
              )
            }
          </View>

        )
      }
    </View>
  );
}

type BoxProps = {
  index1: number,
  index2: number,
  value: 0 | 1,
  handlePress: (index1: number, index2: number,
    value: 0 | 1) => void
}
const Box: FC<BoxProps> = ({ index1, index2, value, handlePress }) => (
  <Pressable
    onPress={() => handlePress(index1, index2, value)}
    style={{
      width: 20,
      height: 20,
      backgroundColor: value === 1 ? "grey" : "red",

    }}>
  </Pressable>
);