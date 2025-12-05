import reducer, { userActions } from './userSlice';
import {
  fetchUser,
  loginUser,
  registerUser,
  updateUser,
  logoutUser
} from '../thunks/userThunk';
import { TUser } from '../../utils/types';

const mockUser: TUser = {
  email: 'test@example.com',
  name: 'Test User'
};

describe('user slice', () => {
  const initialState = {
    user: null,
    userCheck: false,
    requestStatus: 'idle' as const
  };

  it('should return initial state', () => {
    const result = reducer(undefined, { type: '' });
    expect(result).toEqual(initialState);
  });

  describe('sync actions', () => {
    it('should handle setUserCheck', () => {
      const action = userActions.setUserCheck(true);
      const result = reducer(initialState, action);
      
      expect(result.userCheck).toBe(true);
      expect(result.user).toBeNull();
      expect(result.requestStatus).toBe('idle');
    });

    it('should handle userLogout', () => {
      const loggedInState = {
        user: mockUser,
        userCheck: false,
        requestStatus: 'succeeded' as const
      };
      
      const result = reducer(loggedInState, userActions.userLogout());
      
      expect(result.user).toBeNull();
      expect(result.userCheck).toBe(true);
      expect(result.requestStatus).toBe('succeeded');
    });
  });

  describe('fetchUser actions', () => {
    it('should handle fetchUser.pending', () => {
      const action = { type: fetchUser.pending.type };
      const result = reducer(initialState, action);
      
      expect(result).toEqual({
        user: null,
        userCheck: false,
        requestStatus: 'loading'
      });
    });

    it('should handle fetchUser.fulfilled', () => {
      const action = {
        type: fetchUser.fulfilled.type,
        payload: { user: mockUser }
      };
      const result = reducer(initialState, action);
      
      expect(result).toEqual({
        user: mockUser,
        userCheck: true,
        requestStatus: 'succeeded'
      });
    });

    it('should handle fetchUser.rejected', () => {
      const pendingState = {
        ...initialState,
        requestStatus: 'loading' as const
      };
      
      const action = { type: fetchUser.rejected.type };
      const result = reducer(pendingState, action);
      
      expect(result).toEqual({
        user: null,
        userCheck: true,
        requestStatus: 'failed'
      });
    });
  });

  describe('loginUser actions', () => {
    it('should handle loginUser.fulfilled', () => {
      const action = {
        type: loginUser.fulfilled.type,
        payload: { user: mockUser }
      };
      const result = reducer(initialState, action);
      
      expect(result.user).toEqual(mockUser);
      expect(result.userCheck).toBe(false); // Не меняется
      expect(result.requestStatus).toBe('idle'); // Не меняется
    });
  });

  describe('registerUser actions', () => {
    it('should handle registerUser.fulfilled', () => {
      const action = {
        type: registerUser.fulfilled.type,
        payload: { user: mockUser }
      };
      const result = reducer(initialState, action);
      
      expect(result.user).toEqual(mockUser);
    });
  });

  describe('updateUser actions', () => {
    it('should handle updateUser.fulfilled', () => {
      const existingUser: TUser = {
        email: 'old@example.com',
        name: 'Old Name'
      };
      
      const stateWithUser = {
        ...initialState,
        user: existingUser
      };
      
      const updatedUser: TUser = {
        email: 'new@example.com',
        name: 'New Name'
      };
      
      const action = {
        type: updateUser.fulfilled.type,
        payload: { user: updatedUser }
      };
      
      const result = reducer(stateWithUser, action);
      
      expect(result.user).toEqual(updatedUser);
      expect(result.user).not.toEqual(existingUser);
    });
  });

  describe('logoutUser actions', () => {
    it('should handle logoutUser.fulfilled', () => {
      const loggedInState = {
        user: mockUser,
        userCheck: true,
        requestStatus: 'succeeded' as const
      };
      
      const action = { type: logoutUser.fulfilled.type };
      const result = reducer(loggedInState, action);
      
      expect(result.user).toBeNull();
      expect(result.userCheck).toBe(true); // Не меняется
      expect(result.requestStatus).toBe('succeeded'); // Не меняется
    });
  });
});