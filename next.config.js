module.exports = {
    webpack(config) {
        config.module.rules.push({
            test: /\.svg$/,
            use: ["@svgr/webpack"]
        });

        return config;
    },
    images: {
        domains: ['i.pinimg.com', 'i.ibb.co', 'fxqraweyzgsxoqvopnge.supabase.co', 'api.dicebear.com'],
        dangerouslyAllowSVG: true,
        contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    },
};