import React from 'react';

interface Props {
    type: 'concreta' | 'abstrata' | 'interface';
}

const ClassTypeInfo: React.FC<Props> = ({ type }) => {
    if (type === 'abstrata') {
        return (
            <div className="bg-blue-50 border border-blue-200 rounded p-3 text-xs text-blue-900 mb-2">
                <div className="font-semibold mb-1">O que é uma Classe Abstrata?</div>
                <ul className="list-disc ml-5">
                    <li>Uma classe abstrata não pode ser instanciada diretamente</li>
                    <li>Deve ter pelo menos um método abstrato (protegido)</li>
                    <li>Serve como base para outras classes através de herança</li>
                    <li>Pode conter métodos concretos (com implementação) e abstratos</li>
                    <li>Pode conter atributos</li>
                </ul>
                <div className="mt-2 text-blue-700 font-semibold">Uma classe abstrata NÃO pode ser interface ao mesmo tempo!</div>
            </div>
        );
    }
    if (type === 'interface') {
        return (
            <div className="bg-purple-50 border border-purple-200 rounded p-3 text-xs text-purple-900 mb-2">
                <div className="font-semibold mb-1">O que é uma Interface?</div>
                <ul className="list-disc ml-5">
                    <li>Uma interface define um contrato que as classes devem implementar</li>
                    <li>Não pode conter atributos</li>
                    <li>Todos os métodos são públicos e abstratos (sem implementação)</li>
                    <li>Uma classe pode implementar múltiplas interfaces</li>
                    <li>Interfaces podem estender outras interfaces</li>
                </ul>
                <div className="mt-2 text-purple-700 font-semibold">Uma interface é sempre abstrata por definição!</div>
            </div>
        );
    }
    return null;
};

export default ClassTypeInfo;
