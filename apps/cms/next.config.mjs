import { withPayload } from '@payloadcms/next/withPayload'

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Payload maneja sus propias rutas; nada extra por ahora.
}

export default withPayload(nextConfig, { devBundleServerPackages: false })
