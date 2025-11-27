package com.evdms.common.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.util.Date;

@Component
public class JwtTokenProvider {

    @Value("${app.jwtSecret:my-super-secret-key-that-is-at-least-32-characters-long-for-HS256}")
    private String jwtSecret;

    @Value("${app.jwtExpiration:86400000}") // 24 hours in milliseconds
    private long jwtExpiration;

    @Value("${app.jwtRefreshExpiration:604800000}") // 7 days
    private long jwtRefreshExpiration;

    private SecretKey getSigningKey() {
        return Keys.hmacShaKeyFor(jwtSecret.getBytes());
    }
    public String generateToken(String username, String role, Long userId, Long dealerId) {
        Date now = new Date();
        Date expiryDate = new Date(now.getTime() + jwtExpiration);

        return Jwts.builder()
                .subject(username)
                .claim("role", role)
                .claim("userId", userId)
                .claim("dealerId", dealerId)
                .issuedAt(now)
                .expiration(expiryDate)
                .signWith(getSigningKey())
                .compact();
    }
    public String generateRefreshToken(String username) {
        Date now = new Date();
        Date expiryDate = new Date(now.getTime() + jwtRefreshExpiration);

        return Jwts.builder()
                .subject(username)
                .issuedAt(now)
                .expiration(expiryDate)
                .signWith(getSigningKey())
                .compact();
    }
    private Claims getClaimsFromToken(String token) {
        return Jwts.parser()
                .verifyWith(getSigningKey())
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }
    public String getUsernameFromToken(String token) {
        return getClaimsFromToken(token).getSubject();
    }
    public String getRoleFromToken(String token) {
        return (String) getClaimsFromToken(token).get("role");
    }
    public Long getUserIdFromToken(String token) {
        Object userId = getClaimsFromToken(token).get("userId");
        return userId != null ? ((Number) userId).longValue() : null;
    }
    public Long getDealerIdFromToken(String token) {
        Object dealerId = getClaimsFromToken(token).get("dealerId");
        return dealerId != null ? ((Number) dealerId).longValue() : null;
    }
    public boolean validateToken(String token) {
        try {
            Jwts.parser()
                    .verifyWith(getSigningKey())
                    .build()
                    .parseSignedClaims(token);
            return true;
        } catch (Exception e) {
            return false;
        }
    }
    public long getTokenExpiration() {
        return jwtExpiration;
    }
}
