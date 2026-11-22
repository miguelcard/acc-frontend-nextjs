/**
 * @jest-environment jsdom
 */
import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import CreateSpaceForm from '@/components/spaces/CreateSpaceModal/create-space-form';

const mockPush = jest.fn();
jest.mock('next/navigation', () => ({
    useRouter: () => ({ push: mockPush }),
}));

const mockCreateSpace = jest.fn();
jest.mock('@/lib/hooks/mutations', () => ({
    useCreateSpace: () => ({ mutateAsync: mockCreateSpace }),
}));

jest.mock('@/components/space/EmojiSelector/emoji-selector', () => ({
    EmojiSelector: () => <div>emoji selector</div>,
}));

beforeEach(() => jest.clearAllMocks());

/** Renders the form with a controlled step, like DialogModal does, and walks to the last step */
function ControlledForm({ onClose }: { onClose: () => void }) {
    const [step, setStep] = React.useState(0);
    return <CreateSpaceForm step={step} setStep={setStep} handleCloseDialog={onClose} />;
}

async function fillAndReachLastStep() {
    const user = userEvent.setup();
    await user.type(screen.getByLabelText(/space name/i), 'My space');
    await user.click(screen.getByRole('button', { name: 'Next' }));
    await user.click(await screen.findByRole('button', { name: 'Next' }));
    return user;
}

describe('CreateSpaceForm', () => {
    it('redirects to the new space and closes the modal right after creating it', async () => {
        mockCreateSpace.mockResolvedValue({ id: 42 });
        const onClose = jest.fn();
        render(<ControlledForm onClose={onClose} />);

        const user = await fillAndReachLastStep();
        await user.click(await screen.findByRole('button', { name: 'Save' }));

        await waitFor(() => expect(mockPush).toHaveBeenCalledWith('/spaces/42'));
        expect(onClose).toHaveBeenCalledTimes(1);
    });

    it('keeps the modal open on the last step and shows the error when creating fails', async () => {
        mockCreateSpace.mockResolvedValue({ error: 'Something went wrong' });
        const onClose = jest.fn();
        render(<ControlledForm onClose={onClose} />);

        const user = await fillAndReachLastStep();
        await user.click(await screen.findByRole('button', { name: 'Save' }));

        expect(await screen.findByText('Something went wrong')).toBeTruthy();
        expect(mockPush).not.toHaveBeenCalled();
        expect(onClose).not.toHaveBeenCalled();
        // still on the last step (description field), not reset to step 1
        expect(screen.getByLabelText(/description/i)).toBeTruthy();
    });
});
