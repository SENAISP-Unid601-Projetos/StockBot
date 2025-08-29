import React from 'react';
import './button.css';

/**
 * Componente de botão reutilizável e personalizado.
 * @param {object} props
 * @param {React.ReactNode} props.children - O conteúdo do botão (texto, ícone).
 * @param {function} props.onClick - Função para o evento de clique.
 * @param {string} [props.variant='primary'] - A variante de estilo ('primary', 'danger', 'warning').
 * @param {string} [props.type='button'] - O tipo do botão ('button', 'submit').
 * @param {boolean} [props.disabled=false] - Controla se o botão está desabilitado.
 * @param {string} [props.className=''] - Permite adicionar classes CSS extras.
 */
const Button = ({
  children,
  onClick,
  variant = 'primary',
  type = 'button',
  disabled = false,
  className = '',
  ...rest // Pega outras props como 'aria-label'
}) => {
  // Monta as classes CSS: uma base 'btn' e uma específica da variante 'btn-primary'
  const buttonClasses = `btn btn-${variant} ${className}`;

  return (
    <button
      type={type}
      className={buttonClasses}
      onClick={onClick}
      disabled={disabled}
      {...rest}
    >
      {children}
    </button>
  );
};

export default Button;
