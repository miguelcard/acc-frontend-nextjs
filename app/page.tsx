import { Inter } from 'next/font/google'
import Image from 'next/image'
import styles from './page.module.css'
import Box from '@mui/material/Box'

const inter = Inter({ subsets: ['latin'] })

// shoud this go here or in another folder called /home ? or in a folder with pharenteses (site) so that it does not have a path?
/**
 * Landing page for unauthenticated users
 * @returns 
 */
export default function Home() {
  return (
    <main>
      {/* put whole body inside a grid? ... for now not needed ...*/}
      {/* <LandingNavbar /> */}
            <img src={blob} alt="blob" className='home__blob' />
            <Box className='home__hero-header' >
                {/* <HeroBanner /> */}
            </Box>


            {/* Below is just a temp solution to extend the color of the above box and add the copyright text - Can be put in the layout! */}
            <Box sx={{
                display: "flex",
                alignItems: "flex-end",
                justifyContent: "center",
                height: '245px',
                backgroundColor: '#84CEC1'
            }}
            >
                <span
                    style={{
                        color: "#FFFFFF",
                        fontSize: 16,
                        marginBottom: 45,
                        textAlign: "center",
                    }}
                >a Miguel Cardenas production <br />
                    AvidHabits &copy; 2023
                </span>
            </Box>
    </main>
  )
}
