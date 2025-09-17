import React from 'react';
import { TouchableWithoutFeedback, Keyboard, View, StyleSheet, ViewProps } from 'react-native';

interface KeyboardDismissableViewProps extends ViewProps {
    children: React.ReactNode;
}

const KeyboardDismissableView: React.FC<KeyboardDismissableViewProps> = ({ children, ...props }) => {
    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
            <View style={styles.container} {...props}>
                {children}
            </View>
        </TouchableWithoutFeedback>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    }
});

export default KeyboardDismissableView;