// 'use client';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import { useRouter } from "next/navigation";
import React from 'react';
import AppBar from "@mui/material/AppBar";
import Container from "@mui/material/Container";
import Link from "@mui/material/Link";
import Toolbar from "@mui/material/Toolbar";
import NextLink from "next/link";
import Image from "next/image";
import logo from '@/public/images/headers/avidhabits.png';


// TODO ALL THIS FUNCTIONALITY
// You'll have to put this in a separate Layout component for sure, if you want to use data Dynamically in this Navbar
// with this I mean setting the right user profile picture for example, or operations where you have to pass props to this navbar I think
export default function AuthenticatedLayout({
    children,
}: {
    children: React.ReactNode;
}) {

    // const router = useRouter();

    // TODO do logout with 
    function logout() {
        const API = process.env.NEXT_PUBLIC_API;
        const logoutUrl: string = `${API}/v1/logout/`;
        // const token = getTokenFromStorage();

        const requestOptions: RequestInit = {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
                // "Authorization": `token ${token}`,
            },
        };

        fetch(logoutUrl, requestOptions)
            .then((res) => {
                if (!res.ok) {
                    console.warn('An error ocurred on logout');
                }
                // removeTokenFromStorage();
                // router.push('/login');
            });
    }

    return (
        <>
            {/* use sticky navigation on (Desktop view mainly) when home page gets bigger <AppBar position="sticky" */}
            <AppBar position="static" elevation={0} sx={{ p: 1 }} >
                <Container maxWidth="xl" >
                    <Toolbar>
                        {/*
                        The responsiveness of the elements can be handled by the display property, if xs: 'none' it means
                        the element is not shown on small screens, this way we can show or hide the blocks we need for each screen size.
                        we can further add rules for larger screen sizes if required (xs, sm, md, lg, xl...)
                        */}

                        {/*
                        Elements for medium (md) screens and above:
                        */}
                        <Link
                            sx={{ flexGrow: 1, display: { xs: 'flex', md: 'flex' }, mr: 1 }}
                            component={NextLink}
                            href="/"
                        >
                            <Image
                                src={logo}
                                width={130}
                                height={0}
                                alt="logo"
                            // sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw' define something like this to improve future performance on images
                            />
                        </Link>
                        {/* <Box
                            sx={{ flexGrow: 1, gap: '20px', display: { xs: 'none', md: 'flex' } }}
                        >
                            {Object.entries(navbarPages).map(([key, page]) => (
                                <Button
                                    variant='text'
                                    className={styles['landing-header__menu__item']}
                                    component={NextLink}
                                    href={page.linkTo}
                                    key={key}
                                    sx={{ my: 2, color: 'white' }}
                                >
                                    {page.name}
                                </Button>
                            ))}
                        </Box> */}

                        {/* further elements on the end of the NavBar */}
                        <IconButton
                            // onClick={logout}
                            sx={{ p: 0 }}>
                            <Avatar alt="Memy Sharp"
                            // src="/static/images/avatar/2.jpg" 
                            />
                        </IconButton>

                        {/* Navigation bar content for small screens and below */}

                    </Toolbar>
                </Container>
            </AppBar>
            {/* Sidebar (Drawer) used for menu on small screens */}
            {children}
        </>
    );
}


// Read in case you want to customize the nextjs layouts with props or something similar:
// https://stackoverflow.com/questions/75190344/how-to-pass-props-to-layout-js-from-page-js-in-the-app-directory-of-next-js



// here an example AppBar with the user profile and so on:
// 'use client';
// import { getTokenFromStorage, removeTokenFromStorage } from '@/lib/utils';
// import { redirect } from 'next/navigation';
// import React from 'react';
// import { useRouter } from "next/navigation";
// import AppBar from '@mui/material/AppBar';
// import Container from '@mui/material/Container';
// import Toolbar from '@mui/material/Toolbar';
// import Box from '@mui/material/Box';
// import IconButton from '@mui/material/IconButton';
// import MenuIcon from '@mui/icons-material/Menu';
// import Menu from '@mui/material/Menu';
// import MenuItem from '@mui/material/MenuItem';
// import Typography from '@mui/material/Typography';
// import Tooltip from '@mui/material/Tooltip';
// import Button from '@mui/material/Button';
// import Avatar from '@mui/material/Avatar';


// export default function Home() {

//   const router = useRouter();
//   const [anchorElNav, setAnchorElNav] = React.useState(null);
//   const [anchorElUser, setAnchorElUser] = React.useState(null);
//   const pages = ['Dashboard', 'My Scoreboards', 'Groups'];
//   const settings = ['Profile', 'Account', 'Dashboard', 'Logout'];

//   const handleOpenNavMenu = (event: any) => {
//     setAnchorElNav(event.currentTarget);
//   };
//   const handleOpenUserMenu = (event: any) => {
//     setAnchorElUser(event.currentTarget);
//   };

//   const handleCloseNavMenu = () => {
//     setAnchorElNav(null);
//   };

//   const handleCloseUserMenu = () => {
//     setAnchorElUser(null);
//   };

//   function logout() {
//     const API = process.env.NEXT_PUBLIC_API;
//     const logoutUrl: string = `${API}/v1/logout/`;
//     const token = getTokenFromStorage();

//     const requestOptions: RequestInit = {
//       method: 'POST',
//       headers: {
//         "Content-Type": "application/json",
//         "Authorization": `token ${token}`,
//       },
//     };

//     fetch(logoutUrl, requestOptions)
//       .then((res) => {
//         if (!res.ok) {
//           console.warn('An error ocurred on logout');
//         }
//         removeTokenFromStorage();
//         router.push('/login')
//       });
//   }

//   return (
//     <>
//       <AppBar position="static"
//       // elevation={0}
//         className='landing-header'
//       // sx={{ background: '#655dff'}}
//       >
//         <Container maxWidth="xl">
//           <Toolbar disableGutters>
//             {/* <Link
//               sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' }, mr: 1 }}
//               component={RouterLink}
//               to="/"
//             >
//               <img src={logotype} alt="logo" className='landing-header__logo' />
//             </Link> */}


//             <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
//               <IconButton
//                 size="large"
//                 aria-label="account of current user"
//                 aria-controls="menu-appbar"
//                 aria-haspopup="true"
//                 onClick={handleOpenNavMenu}
//                 color="inherit"
//               >
//                 <MenuIcon />
//               </IconButton>
//               <Menu
//                 id="menu-appbar"
//                 anchorEl={anchorElNav}
//                 anchorOrigin={{
//                   vertical: 'bottom',
//                   horizontal: 'left',
//                 }}
//                 keepMounted
//                 transformOrigin={{
//                   vertical: 'top',
//                   horizontal: 'left',
//                 }}
//                 open={Boolean(anchorElNav)}
//                 onClose={handleCloseNavMenu}
//                 sx={{
//                   display: { xs: 'block', md: 'none' },
//                 }}
//               >
//                 {pages.map((page) => (
//                   <MenuItem key={page} onClick={handleCloseNavMenu}>
//                     <Typography textAlign="center">{page}</Typography>
//                   </MenuItem>
//                 ))}
//               </Menu>
//             </Box>
//             {/* <AdbIcon sx={{ display: { xs: 'flex', md: 'none' }, mr: 1 }} />
//                     <Typography
//                         variant="h5"
//                         noWrap
//                         component="a"
//                         href=""
//                         sx={{
//                             mr: 2,
//                             display: { xs: 'flex', md: 'none' },
//                             flexGrow: 1,
//                             fontFamily: 'monospace',
//                             fontWeight: 700,
//                             letterSpacing: '.3rem',
//                             color: 'inherit',
//                             textDecoration: 'none',
//                         }}
//                     >
//                         LOGO
//                     </Typography> */}
//             <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
//               {pages.map((page) => (
//                 <Button
//                   key={page}
//                   onClick={handleCloseNavMenu}
//                   sx={{ my: 2, color: 'white', display: 'block' }}
//                 >
//                   {page}
//                 </Button>
//               ))}
//             </Box>

//             <Box sx={{ flexGrow: 0 }}>
//               <Tooltip title="Open settings">
//                 <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
//                   <Avatar alt="Memy Sharp" src="/static/images/avatar/2.jpg" />
//                 </IconButton>
//               </Tooltip>
//               <Menu
//                 sx={{ mt: '45px' }}
//                 id="menu-appbar"
//                 anchorEl={anchorElUser}
//                 anchorOrigin={{
//                   vertical: 'top',
//                   horizontal: 'right',
//                 }}
//                 keepMounted
//                 transformOrigin={{
//                   vertical: 'top',
//                   horizontal: 'right',
//                 }}
//                 open={Boolean(anchorElUser)}
//                 onClose={handleCloseUserMenu}
//               >
//                 {settings.map((setting) => (
//                   <MenuItem key={setting} onClick={logout}>
//                     <Typography textAlign="center">{setting}</Typography>
//                   </MenuItem>
//                 ))}
//               </Menu>
//             </Box>
//           </Toolbar>
//         </Container>
//       </AppBar>
//     </>
//   );
// }