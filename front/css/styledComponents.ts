import styled from 'styled-components';

export const Div = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;
    gap: 2rem;
    min-height: 100vh;
    background-color: #f8f9fa;
    font-family: 'Anybody', sans-serif;

    h2 {
        font-size: 1.4rem;
        color: #007bff;
        width: 100%;
        text-align: center;
    }
`;

export const Navbar = styled.nav`
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem 2rem;
    background-color: #f8f9fa;
    color: white;
    width: 100%;
    position: sticky;
    top: 0;
    z-index: 10;
    box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15);

    h1 {
        margin: 0;
        color: #007bff;
        font-family: 'Anybody', sans-serif;
        font-size: 1.4rem;
    }
`;

export const Admin = styled.button`
    background-color: #007bff;
    color: white;
    border: none;
    padding: 0.3rem 0.5rem;
    border-radius: 0.25rem;
    cursor: pointer;
    position: absolute;
    right: 1rem;

    a {
        color: white;
        text-decoration: none;
        font-size: 0.7rem !important;
    }
`;

export const Form = styled.form`
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 0.5rem;
    width: 50%;

    label {
        font-size: 0.8rem;
        color: #007bff;
    }

    input, select {
        padding: 0.5rem;
        border: 1px solid #007bff;
        border-radius: 0.25rem;
        font-size: 0.8rem;
        width: 200px;
    }

    textarea {
        padding: 0.5rem;
        border: 1px solid #007bff;
        border-radius: 0.25rem;
        font-size: 0.8rem;
        width: 410px;

         @media (max-width: 768px) {
            width: 200px;
        }
    }

    .error {
        color: red;
        font-size: 0.8rem;
    }

    @media (min-width: 768px) {
        input, select {
            width: 200px;
        }
    }

    .form-group{
        margin-bottom: 0;
    }
`;

export const ContainerButton = styled.div`
    display: flex;
    justify-content: flex-start;
    align-items: center;
    gap: 1rem;
    width: 400px;

    @media (max-width: 768px) {
        width: 200px;
        justify-content: flex-start;
        gap: 0.5rem;
    }
`;

export const SubmitButton = styled.button`
    background-color: #007bff;
    color: white;
    border: none;
    padding: 0.5rem 1rem;
    border-radius: 0.25rem;
    cursor: pointer;
    margin-top: 1rem;
    width: fit-content;
    height: 35px;
    font-size: small;
    &:disabled {
        background-color: #b0c4de;
        cursor: not-allowed;
    }
`;

export const ErrorMessage = styled.div<{ success: boolean }>`
    color: ${props => (props.success ? 'green' : 'red')};
    font-size: 0.8rem;
`;

export const ColorOption = styled.option<{ color: string }>`
    background-color: ${props => props.color};
    color: white;
`;
