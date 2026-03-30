import { HeadContent, Scripts, createRootRoute } from '@tanstack/react-router'
import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools'
import { TanStackDevtools } from '@tanstack/react-devtools'

import appCss from '../styles.css?url'

const THEME_INIT_SCRIPT = `(function(){document.documentElement.classList.add('dark');})();`

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { title: '대도의 비밀 장부 (The Vault)' },
      {
        name: 'description',
        content:
          '조용히 침입하여 최고의 보물을 선점하십시오. 모든 기록은 비밀이며, 결과는 오직 명성으로 증명됩니다.',
      },
      { property: 'og:type', content: 'website' },
      { property: 'og:title', content: '대도의 비밀 장부 (The Vault)' },
      {
        property: 'og:description',
        content:
          '조용히 침입하여 최고의 보물을 선점하십시오. 모든 기록은 비밀이며, 결과는 오직 명성으로 증명됩니다.',
      },
      {
        property: 'og:image',
        content: 'https://the-vault-orpin.vercel.app/og-image.png',
      },
      { property: 'og:image:width', content: '1200' },
      { property: 'og:image:height', content: '630' },
      { property: 'og:locale', content: 'ko_KR' },
    ],
    links: [
      { rel: 'stylesheet', href: appCss },
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
    ],
  }),
  shellComponent: RootDocument,
})

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko" className="dark" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} />
        <HeadContent />
      </head>
      <body className="bg-background text-on-surface min-h-screen selection:bg-primary/30">
        <div className="flex w-full min-h-screen">{children}</div>
        <TanStackDevtools
          config={{ position: 'bottom-right' }}
          plugins={[
            {
              name: 'Tanstack Router',
              render: <TanStackRouterDevtoolsPanel />,
            },
          ]}
        />
        <Scripts />
      </body>
    </html>
  )
}
