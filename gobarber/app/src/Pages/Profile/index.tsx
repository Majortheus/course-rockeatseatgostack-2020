import React, { useCallback, useRef } from 'react';
import {
  PermissionsAndroid,
  View,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TextInput,
  Alert,
} from 'react-native';
import * as Yup from 'yup';
import Icon from 'react-native-vector-icons/Feather';
import { launchImageLibrary } from 'react-native-image-picker';

import { useNavigation } from '@react-navigation/native';
import { Form } from '@unform/mobile';
import { FormHandles } from '@unform/core';
import Input from '../../components/Input';
import Button from '../../components/Button';

import {
  Container,
  Title,
  BackButton,
  UserAvatarButton,
  UserAvatar,
} from './styles';
import getValidationErrors from '../../utils/getValidationErrors';
import api from '../../services/api';
import { useAuth } from '../../hooks/auth';

interface ProfileFormData {
  name: string;
  email: string;
  old_password: string;
  password: string;
  password_confirmation: string;
}

const Profile: React.FC = () => {
  const { user, updateUser } = useAuth();

  const formRef = useRef<FormHandles>(null);
  const emailRef = useRef<TextInput>(null);
  const oldPasswordRef = useRef<TextInput>(null);
  const passwordRef = useRef<TextInput>(null);
  const confirmPasswordRef = useRef<TextInput>(null);
  const navigation = useNavigation();

  const handleSignUp = useCallback(
    async (data: ProfileFormData) => {
      try {
        formRef.current?.setErrors({});

        const schema = Yup.object().shape({
          name: Yup.string().required('Nome obrigatório'),
          email: Yup.string()
            .required('E-mail obrigatório')
            .email('Digite um e-mail válido'),
          old_npassword: Yup.string(),
          password: Yup.string().when('old_password', {
            is: val => !!val.length,
            then: Yup.string().min(
              6,
              'Nova senha obrigatória ter no mínimo 6 dígitos',
            ),
            otherwise: Yup.string().notRequired(),
          }),
          password_confirmation: Yup.string()
            .when('old_password', {
              is: val => !!val.length,
              then: Yup.string().min(6, 'Obrigatória a confirmação de senha'),
              otherwise: Yup.string().notRequired(),
            })
            .oneOf([Yup.ref('password')], 'Senhas não estão iguais'),
        });

        await schema.validate(data, {
          abortEarly: false,
        });

        const {
          name,
          email,
          old_password,
          password,
          password_confirmation,
        } = data;

        const formData = {
          name,
          email,
          ...(old_password
            ? { old_password, password, password_confirmation }
            : {}),
        };

        const response = await api.put('/profile', formData);

        updateUser(response.data);

        Alert.alert('Perfil atualizado com sucesso');
        navigation.goBack();
      } catch (err) {
        if (err instanceof Yup.ValidationError) {
          const errors = getValidationErrors(err);

          formRef.current?.setErrors(errors);
          return;
        }

        Alert.alert(
          'Erro na atualização do perfil',
          'Ocorreu um erro ao atualizar seu perfil, tente novamente.',
        );
      }
    },
    [navigation, updateUser],
  );

  const handleUpdateAvatar = useCallback(async () => {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.CAMERA,
    );

    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
      launchImageLibrary(
        {
          mediaType: 'photo',
        },
        response => {
          if (response.didCancel) {
            return;
          }

          if (response.errorMessage) {
            Alert.alert('Erro ao atualizar seu avatar.');
            return;
          }

          const data = new FormData();
          data.append('avatar', {
            type: 'image/jpeg',
            name: `${user.id}.jpg`,
            uri: response.uri,
          });

          api.patch('/users/avatar', data).then(apiResponse => {
            updateUser(apiResponse.data);
          });
        },
      );
    }
  }, [updateUser, user.id]);

  const handleSubmit = useCallback(() => {
    formRef.current?.submitForm();
  }, []);

  const handleFocusEmail = useCallback(() => {
    emailRef.current?.focus();
  }, []);

  const handleFocusOldPassword = useCallback(() => {
    oldPasswordRef.current?.focus();
  }, []);

  const handleFocusPassword = useCallback(() => {
    passwordRef.current?.focus();
  }, []);

  const handleFocusConfirmPassword = useCallback(() => {
    confirmPasswordRef.current?.focus();
  }, []);

  return (
    <>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        enabled
      >
        <ScrollView
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{ flex: 1 }}
        >
          <Container>
            <BackButton onPress={navigation.goBack}>
              <Icon name="chevron-left" size={24} color="#999591" />
            </BackButton>

            <UserAvatarButton onPress={handleUpdateAvatar}>
              <UserAvatar source={{ uri: user.avatar_url }} />
            </UserAvatarButton>

            <View>
              <Title>Meu perfil</Title>
            </View>

            <Form
              initialData={user}
              style={{ width: '100%' }}
              ref={formRef}
              onSubmit={handleSignUp}
            >
              <Input
                name="name"
                icon="user"
                placeholder="Nome"
                textContentType="name"
                autoCapitalize="words"
                returnKeyType="next"
                onSubmitEditing={handleFocusEmail}
              />

              <Input
                ref={emailRef}
                name="email"
                icon="mail"
                placeholder="E-mail"
                textContentType="emailAddress"
                keyboardType="email-address"
                autoCorrect={false}
                autoCapitalize="none"
                returnKeyType="next"
                onSubmitEditing={handleFocusOldPassword}
              />

              <Input
                ref={oldPasswordRef}
                name="old_password"
                icon="lock"
                placeholder="Senha atual"
                secureTextEntry
                returnKeyType="next"
                textContentType="newPassword"
                containerStyle={{ marginTop: 16 }}
                onSubmitEditing={handleFocusPassword}
              />

              <Input
                ref={passwordRef}
                name="password"
                icon="lock"
                placeholder="Nova senha"
                secureTextEntry
                returnKeyType="next"
                textContentType="newPassword"
                onSubmitEditing={handleFocusConfirmPassword}
              />

              <Input
                ref={confirmPasswordRef}
                name="password_confirmation"
                icon="lock"
                placeholder="Confirmar senha"
                secureTextEntry
                returnKeyType="send"
                textContentType="newPassword"
                onSubmitEditing={handleSubmit}
              />

              <Button onPress={handleSubmit}>Confirmar mudanças</Button>
            </Form>
          </Container>
        </ScrollView>
      </KeyboardAvoidingView>
    </>
  );
};

export default Profile;
