const mockListeners: Record<string, (payload: any) => void> = {};
const mockPlugin = {
    addListener: jest.fn(async (event: string, cb: (p: any) => void) => {
        mockListeners[event] = cb;
        return { remove: jest.fn(async () => {}) };
    }),
    checkPermissions: jest.fn(),
    requestPermissions: jest.fn(),
    register: jest.fn(async () => {}),
    unregister: jest.fn(async () => {}),
};
const mockCapacitor = { isNativePlatform: jest.fn(), getPlatform: jest.fn() };
const mockRegister = jest.fn(async () => true);
const mockUnregister = jest.fn(async () => true);

jest.mock('@capacitor/core', () => ({ Capacitor: mockCapacitor }));
jest.mock('@capacitor/push-notifications', () => ({ PushNotifications: mockPlugin }));
jest.mock('@/lib/fetch-mutations', () => ({
    registerDeviceToken: mockRegister,
    unregisterDeviceToken: mockUnregister,
}));

type PushModule = typeof import('@/lib/push-notifications');
let initPushRegistration: PushModule['initPushRegistration'];
let unregisterPush: PushModule['unregisterPush'];

function setPlatform(native: boolean, platform: string) {
    mockCapacitor.isNativePlatform.mockReturnValue(native);
    mockCapacitor.getPlatform.mockReturnValue(platform);
}

beforeEach(() => {
    jest.clearAllMocks();
    setPlatform(true, 'android');
    // The module keeps the last token in module state; load a fresh copy for every test
    // so tests cannot depend on each other's leftovers.
    jest.isolateModules(() => {
        const mod: PushModule = require('@/lib/push-notifications');
        initPushRegistration = mod.initPushRegistration;
        unregisterPush = mod.unregisterPush;
    });
});

describe('initPushRegistration', () => {
    it('is a no-op on web', async () => {
        setPlatform(false, 'web');
        await initPushRegistration();
        expect(mockPlugin.checkPermissions).not.toHaveBeenCalled();
        expect(mockPlugin.register).not.toHaveBeenCalled();
    });

    it('is a no-op on iOS (deferred)', async () => {
        setPlatform(true, 'ios');
        await initPushRegistration();
        expect(mockPlugin.checkPermissions).not.toHaveBeenCalled();
    });

    it('requests permission when undecided and registers when granted', async () => {
        mockPlugin.checkPermissions.mockResolvedValue({ receive: 'prompt' });
        mockPlugin.requestPermissions.mockResolvedValue({ receive: 'granted' });
        await initPushRegistration();
        expect(mockPlugin.requestPermissions).toHaveBeenCalled();
        expect(mockPlugin.register).toHaveBeenCalled();
    });

    it('does not register when permission is denied', async () => {
        mockPlugin.checkPermissions.mockResolvedValue({ receive: 'prompt' });
        mockPlugin.requestPermissions.mockResolvedValue({ receive: 'denied' });
        await initPushRegistration();
        expect(mockPlugin.register).not.toHaveBeenCalled();
    });

    it('does not re-prompt when already granted', async () => {
        mockPlugin.checkPermissions.mockResolvedValue({ receive: 'granted' });
        await initPushRegistration();
        expect(mockPlugin.requestPermissions).not.toHaveBeenCalled();
        expect(mockPlugin.register).toHaveBeenCalled();
    });

    it('posts the token on registration and again on refresh', async () => {
        mockPlugin.checkPermissions.mockResolvedValue({ receive: 'granted' });
        await initPushRegistration();
        await mockListeners['registration']({ value: 'tok-1' });
        await mockListeners['registration']({ value: 'tok-2' });
        expect(mockRegister).toHaveBeenNthCalledWith(1, 'tok-1', 'android');
        expect(mockRegister).toHaveBeenNthCalledWith(2, 'tok-2', 'android');
    });
});

describe('unregisterPush', () => {
    it('deletes the last registered token and unregisters from FCM', async () => {
        mockPlugin.checkPermissions.mockResolvedValue({ receive: 'granted' });
        await initPushRegistration();
        await mockListeners['registration']({ value: 'tok-9' });
        await unregisterPush();
        expect(mockUnregister).toHaveBeenCalledWith('tok-9');
        expect(mockPlugin.unregister).toHaveBeenCalled();
    });

    it('never throws when the backend call fails', async () => {
        mockPlugin.checkPermissions.mockResolvedValue({ receive: 'granted' });
        await initPushRegistration();
        await mockListeners['registration']({ value: 'tok-x' });
        mockUnregister.mockRejectedValueOnce(new Error('offline'));
        await expect(unregisterPush()).resolves.toBeUndefined();
    });

    it('does nothing when no token was registered', async () => {
        await unregisterPush();
        expect(mockUnregister).not.toHaveBeenCalled();
    });
});
