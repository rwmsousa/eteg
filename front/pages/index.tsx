import { useState } from 'react';
import { useFormik } from 'formik';
import registerClient from '../provider/clientProvider';
import clientValidationSchema from '../provider/validationSchema';
import { Div, Navbar, Form, ContainerButton, SubmitButton, ErrorMessage, ColorOption } from '../css/styledComponents';

export default function Home() {
    const [errorMessage, setErrorMessage] = useState<string>('');
    const [isSuccess, setIsSuccess] = useState<boolean>(false);

    const formik = useFormik({
        initialValues: {
            name: '',
            email: '',
            cpf: '',
            color: '',
            annotations: ''
        },
        validationSchema: clientValidationSchema,
        validateOnChange: true,
        validateOnBlur: true,
        onSubmit: async (values, { setSubmitting, resetForm }) => {
            setErrorMessage('');
            setIsSuccess(false);
            try {
                const response = await registerClient(values);
                if ('error' in response) {
                    setErrorMessage(response.error);
                } else {
                    setErrorMessage('Cadastro realizado com sucesso!');
                    setIsSuccess(true);
                    resetForm();
                }
            } catch (error) {
                setErrorMessage((error as { error: string }).error);
            } finally {
                setSubmitting(false);
            }
        }
    });

    return (
        <Div>
            <Navbar>
                <h1>{ process.env.NEXT_PUBLIC_COMPANY_NAME }</h1>
                {/* <Admin>
                    <a href="/admin">Admin</a>
                </Admin> */}
            </Navbar>
            <h2>Cadastro de clientes</h2>
            <Form onSubmit={formik.handleSubmit}>
                <div className="form-group">
                    <label htmlFor="name">Nome completo</label>
                    <input
                        type="text"
                        className="form-control"
                        id="name"
                        name="name"
                        placeholder="John Doe"
                        value={formik.values.name}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                    />
                    {formik.touched.name && formik.errors.name ? (
                        <div className="error">{formik.errors.name}</div>
                    ) : null}
                </div>
                <div className="form-group">
                    <label htmlFor="email">Email</label>
                    <input
                        type="email"
                        className="form-control"
                        id="email"
                        name="email"
                        placeholder="name@example.com"
                        value={formik.values.email}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                    />
                    {formik.touched.email && formik.errors.email ? (
                        <div className="error">{formik.errors.email}</div>
                    ) : null}
                </div>
                <div className="form-group">
                    <label htmlFor="cpf">CPF</label>
                    <input
                        type="text"
                        className="form-control"
                        id="cpf"
                        name="cpf"
                        placeholder="11122233344"
                        value={formik.values.cpf}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                    />
                    {formik.touched.cpf && formik.errors.cpf ? (
                        <div className="error">{formik.errors.cpf}</div>
                    ) : null}
                </div>
                <div className="form-group">
                    <label htmlFor="color">Cor</label>
                    <select
                        className="form-control"
                        id="color"
                        name="color"
                        value={formik.values.color}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        style={{ backgroundColor: formik.values.color }}
                    >
                        <option value="" label="Selecione uma cor" />
                        <ColorOption value="Vermelho" color="red" label="Vermelho" />
                        <ColorOption value="Laranja" color="orange" label="Laranja" />
                        <ColorOption value="Amarelo" color="yellow" label="Amarelo" />
                        <ColorOption value="Verde" color="green" label="Verde" />
                        <ColorOption value="Azul" color="blue" label="Azul" />
                        <ColorOption value="Anil" color="indigo" label="Anil" />
                        <ColorOption value="Violeta" color="violet" label="Violeta" />
                    </select>
                    {formik.touched.color && formik.errors.color ? (
                        <div className="error">{formik.errors.color}</div>
                    ) : null}
                </div>
                <div className="form-group">
                    <label htmlFor="annotations">Observações</label>
                    <textarea
                        className="form-control"
                        id="annotations"
                        name="annotations"
                        placeholder="Digite suas observações aqui"
                        value={formik.values.annotations}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                    />
                    {formik.touched.annotations && formik.errors.annotations ? (
                        <div className="error">{formik.errors.annotations}</div>
                    ) : null}
                </div>
                <ContainerButton>
                    <SubmitButton type="submit">
                        Cadastrar
                    </SubmitButton>
                    { errorMessage && <ErrorMessage className="success" success={ isSuccess }>{ errorMessage }</ErrorMessage> }
                </ContainerButton>
            </Form>
        </Div>
    );
}