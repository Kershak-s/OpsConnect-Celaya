// Animaciones avanzadas para el login de Ops Connect

document.addEventListener('DOMContentLoaded', function() {
    // Verificar si estamos en la página de login
    if (!document.querySelector('.login-container')) return;

    // Animación de partículas adicionales
    function createParticle() {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.cssText = `
            position: absolute;
            width: 4px;
            height: 4px;
            background: rgba(255, 255, 255, 0.3);
            border-radius: 50%;
            pointer-events: none;
            animation: float-particle 10s linear;
        `;
        
        particle.style.left = Math.random() * 100 + '%';
        particle.style.animationDelay = Math.random() * 5 + 's';
        
        document.querySelector('.bg-animation').appendChild(particle);
        
        setTimeout(() => particle.remove(), 10000);
    }

    // Crear partículas periódicamente
    setInterval(createParticle, 500);

    // Validación en tiempo real
    const userIdInput = document.getElementById('user_id');
    const passwordInput = document.getElementById('password');
    
    // Validar GPID mientras se escribe
    userIdInput.addEventListener('input', function() {
        const value = this.value.trim();
        const parent = this.closest('.form-group');
        
        // Remover mensajes de error anteriores
        const existingError = parent.querySelector('.error-message');
        if (existingError) existingError.remove();
        
        if (value.length > 0 && value.length < 3) {
            const errorDiv = document.createElement('div');
            errorDiv.className = 'error-message';
            errorDiv.innerHTML = '<i class="fas fa-exclamation-circle"></i><span>El GPID debe tener al menos 3 caracteres</span>';
            parent.appendChild(errorDiv);
        }
    });

    // Mostrar fuerza de contraseña
    const strengthIndicator = document.createElement('div');
    strengthIndicator.className = 'password-strength';
    strengthIndicator.style.cssText = `
        height: 3px;
        background: #e5e7eb;
        border-radius: 3px;
        margin-top: 5px;
        overflow: hidden;
        display: none;
    `;
    
    const strengthBar = document.createElement('div');
    strengthBar.style.cssText = `
        height: 100%;
        width: 0;
        transition: all 0.3s ease;
        border-radius: 3px;
    `;
    
    strengthIndicator.appendChild(strengthBar);
    passwordInput.closest('.form-group').appendChild(strengthIndicator);
    
    passwordInput.addEventListener('input', function() {
        const value = this.value;
        let strength = 0;
        
        if (value.length > 0) {
            strengthIndicator.style.display = 'block';
            
            // Calcular fuerza
            if (value.length >= 8) strength += 25;
            if (value.match(/[a-z]/) && value.match(/[A-Z]/)) strength += 25;
            if (value.match(/[0-9]/)) strength += 25;
            if (value.match(/[^a-zA-Z0-9]/)) strength += 25;
            
            // Aplicar colores según la fuerza
            if (strength <= 25) {
                strengthBar.style.background = '#ef4444';
                strengthBar.style.width = '25%';
            } else if (strength <= 50) {
                strengthBar.style.background = '#f59e0b';
                strengthBar.style.width = '50%';
            } else if (strength <= 75) {
                strengthBar.style.background = '#3b82f6';
                strengthBar.style.width = '75%';
            } else {
                strengthBar.style.background = '#10b981';
                strengthBar.style.width = '100%';
            }
        } else {
            strengthIndicator.style.display = 'none';
        }
    });

    // Animación de logo al hacer hover
    const logo = document.querySelector('.login-logo img');
    if (logo) {
        logo.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.1) rotate(5deg)';
        });
        
        logo.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1) rotate(0deg)';
        });
    }

    // Efecto de escritura para el título
    const title = document.querySelector('.login-title');
    if (title) {
        const text = title.textContent;
        title.textContent = '';
        let index = 0;
        
        function typeWriter() {
            if (index < text.length) {
                title.textContent += text.charAt(index);
                index++;
                setTimeout(typeWriter, 100);
            }
        }
        
        setTimeout(typeWriter, 1000);
    }

    // Easter egg: Konami code
    const konamiCode = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
    let konamiIndex = 0;
    
    document.addEventListener('keydown', function(e) {
        if (e.key === konamiCode[konamiIndex]) {
            konamiIndex++;
            if (konamiIndex === konamiCode.length) {
                document.querySelector('.login-card').style.animation = 'rainbow 2s linear infinite';
                setTimeout(() => {
                    document.querySelector('.login-card').style.animation = '';
                }, 5000);
                konamiIndex = 0;
            }
        } else {
            konamiIndex = 0;
        }
    });
});

// CSS adicional para las animaciones
const style = document.createElement('style');
style.textContent = `
    @keyframes float-particle {
        from {
            transform: translateY(100vh) rotate(0deg);
            opacity: 0;
        }
        10% {
            opacity: 1;
        }
        90% {
            opacity: 1;
        }
        to {
            transform: translateY(-100vh) rotate(720deg);
            opacity: 0;
        }
    }
    
    @keyframes rainbow {
        0% { filter: hue-rotate(0deg); }
        100% { filter: hue-rotate(360deg); }
    }
    
    .login-logo img {
        transition: transform 0.3s ease;
    }
    
    .password-strength {
        position: relative;
        background: #e5e7eb;
    }
`;
document.head.appendChild(style);
