/**
 * @jest-environment jsdom
 */
import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Formik, Form, useFormikContext } from 'formik';
import UserAvatarSelector from '@/components/profile/ChangeUserAvatarModal/user-avatar-selector';
import { UserT } from '@/lib/types-and-constants';

// Expose the seed the preview receives so tests can compare it with the saved form value.
jest.mock('@/components/shared/UserAvatar/user-avatar', () => ({
    __esModule: true,
    default: ({ seed, circleDiameter }: { seed?: string; circleDiameter?: number }) => (
        <div data-testid={circleDiameter === 70 ? 'preview-avatar' : 'option-avatar'} data-seed={seed} />
    ),
}));

function FormValueProbe() {
    const { values } = useFormikContext<{ avatar_seed?: string }>();
    return <output data-testid="saved-seed">{values.avatar_seed ?? ''}</output>;
}

function renderSelector(initialSeed: string | null) {
    const user = { id: 1, username: 'tester', avatar_seed: initialSeed } as unknown as UserT;
    return render(
        <Formik initialValues={{ avatar_seed: initialSeed ?? '' }} onSubmit={() => {}}>
            <Form>
                <UserAvatarSelector user={user} />
                <FormValueProbe />
            </Form>
        </Formik>,
    );
}

describe('UserAvatarSelector', () => {
    it('keeps the saved form value in sync with the seed shown in the preview', async () => {
        const user = userEvent.setup();
        renderSelector('robot');

        const input = screen.getByLabelText(/seed/i);
        await user.clear(input);
        await user.type(input, 'hello');

        await waitFor(() => {
            expect(screen.getByTestId('saved-seed').textContent).toBe('hello');
        });
        expect(screen.getByTestId('preview-avatar').getAttribute('data-seed')).toBe('hello');
    });

    it('saves the seed when an example avatar is clicked', async () => {
        const user = userEvent.setup();
        renderSelector('');

        const options = screen.getAllByTestId('option-avatar');
        const chosenSeed = options[0].getAttribute('data-seed') as string;
        await user.click(options[0]);

        await waitFor(() => {
            expect(screen.getByTestId('saved-seed').textContent).toBe(chosenSeed);
        });
        expect((screen.getByLabelText(/seed/i) as HTMLInputElement).value).toBe(chosenSeed);
    });

    it('does not loop or overwrite the initial seed on mount', async () => {
        renderSelector('initial');
        // Let Formik's async validation from the mount-time setFieldValue settle inside act.
        await screen.findByTestId('saved-seed');
        await waitFor(() => {
            expect(screen.getByTestId('saved-seed').textContent).toBe('initial');
        });
        expect(screen.getByTestId('preview-avatar').getAttribute('data-seed')).toBe('initial');
    });
});
