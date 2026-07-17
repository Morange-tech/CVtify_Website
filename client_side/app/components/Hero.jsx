'use client';

import Image from 'next/image';
import { Box, Button, Container, Typography } from '@mui/material';
import Link from 'next/link';
import { useLanguage } from '../hooks/useLanguage';

export default function Hero() {
  const { t } = useLanguage();

  return (
    <Box bgcolor="white">

      {/* HERO SECTION */}
      <Box
        sx={{
          backgroundColor: 'rgba(252,248,241,0.3)',
          py: { xs: 6, md: 10 },
        }}
      >
        <Container maxWidth="lg">
          <Box
            display="grid"
            gridTemplateColumns={{ xs: '1fr', lg: '1fr 1fr' }}
            gap={6}
            alignItems="center"
          >
            {/* Text */}
            <Box>
              <Typography
                textTransform="uppercase"
                fontWeight={600}
                color="primary"
                letterSpacing={1}
              >
                {t('hero.eyebrow')}
              </Typography>

              <Typography
                variant="h2"
                fontWeight={700}
                mt={2}
                sx={{ fontSize: { xs: '2.5rem', md: '4rem', xl: '5rem' } }}
              >
                {t('hero.heading')}
              </Typography>

              <Typography mt={2} fontSize={18}>
                {t('hero.subheading')}
              </Typography>

              <Button
                variant="contained"
                sx={{
                  mt: 4,
                  bgcolor: '#EAB308',
                  color: 'black',
                  borderRadius: '999px',
                  px: 4,
                  py: 1.5,
                  fontWeight: 600,
                  '&:hover': {
                    bgcolor: '#EAB308',
                  },
                }}
              >
                {t('hero.browseTemplates')}
              </Button>

              <Typography mt={2} color="text.secondary">
                {t('hero.alreadyJoined')}{' '}
                <Link href="/login" style={{ color: 'black', fontWeight: 500 }}>
                  {t('hero.login')}
                </Link>
              </Typography>
            </Box>

            {/* Image */}
            <Box>
              <Image
                src="/images/hero_template.png"
                alt="Hero"
                width={600}
                height={500}
                style={{ width: '100%', height: 'auto' }}
              />
            </Box>
          </Box>
        </Container>
      </Box>
    </Box>
  );
}
