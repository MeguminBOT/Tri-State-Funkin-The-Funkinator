#pragma header
vec2 uv = openfl_TextureCoordv.xy;
vec2 fragCoord = openfl_TextureCoordv*openfl_TextureSize;
vec2 iResolution = openfl_TextureSize;
uniform float iTime;
#define iChannel0 bitmap
#define texture flixel_texture2D
#define fragColor gl_FragColor
#define mainImage main

//blend everything together
#define raysIntensity 0.25
#define raysSaturation 0.5
#define raysBlend 2
//0 = Addition, 1 = Lighten Only (max()), 2 = Volumetric Lightning
//any other number will show only the rays

vec3 colorWeights = vec3(0.299, 0.587, 0.114);

void mainImage() {
    vec2 ps = vec2(1.0) / iResolution.xy;
 	vec2 uv = fragCoord * ps;
    vec3 col = texture(iChannel0, uv).rgb;
    vec3 rays = texture(iChannel1, uv).rgb;
    
    rays = mix(vec3(dot(rays, colorWeights)), rays, raysSaturation);
    rays = pow(rays, vec3(2.2)); //linear-to-gamma
    
    //addition
    #if raysBlend == 0
    col += rays * vec3(raysIntensity);
    //lighten only
    #elif raysBlend == 1
    col = max(col, rays * vec3(raysIntensity));
    //volumetric lighting
    #elif raysBlend == 2
    col += rays * vec3(raysIntensity);
    col -= mix(vec3(0.0), vec3(1.0) - rays, raysIntensity);
    //only rays
    #else
    col = rays;
    #endif
    fragColor = vec4(col, 1.0);
}