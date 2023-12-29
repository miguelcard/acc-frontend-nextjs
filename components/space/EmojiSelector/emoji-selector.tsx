'use client';
import { stringIconMapper } from '@/lib/fa-icons-mapper';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import React, { useState } from 'react';
import styles from './emoji-selector.module.css';
import { useFormikContext } from 'formik';
import Typography from '@mui/material/Typography';

interface EmojiSelectorProps {
    title?: string;
}

export function EmojiSelector({ title }: EmojiSelectorProps) {

    // state to keep the one clicked hightlighted
    const [hightlightedAvatar, setHightlightedAvatar] = useState<string>('');

    // Use formik to update the avatar field value without having to have an explicit Formik Field in the GUI
    const formik = useFormikContext();

    const updateFomrikFieldValue = (avatarKey: string) => {
        setHightlightedAvatar(avatarKey);
        formik.setFieldValue('icon_alias', avatarKey);
    };


    return (
        <Box>
            {title && (
                <Typography component='div' fontSize={'0.9em'} fontWeight={400} color={'grey.600'} pb={2} textAlign={'center'}>
                    {title}
                </Typography>
            )}
            <Grid container spacing={{ xs: 2, md: 2 }} columns={{ xs: 14, sm: 16, md: 20 }}>
                {Object.entries(stringIconMapper).map(([key]) => (
                    <Grid item xs={2} sm={2} md={2} key={key} >
                        <FontAwesomeIcon icon={stringIconMapper[`${key}`]} size='lg' className={styles[key === hightlightedAvatar ? 'fa-icon--hightlited' : 'fa-icon']} onClick={() => updateFomrikFieldValue(key)} />
                    </Grid>
                ))}
            </Grid>
        </Box>
    )
}