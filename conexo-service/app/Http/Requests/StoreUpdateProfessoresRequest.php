<?php

namespace App\Http\Requests;

use Illuminate\Validation\Rule;
use Illuminate\Foundation\Http\FormRequest;

class StoreUpdateProfessoresRequest extends FormRequest
{

    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $rules =  [
            'nome' => 'required|min:3|max:255',
            'login' => [
                'required',
                'max:255'
            ],
            'senha' => [
                'required',
                'min:6',
                'max:100'
            ]
        ];

        if ($this->method() === 'PATCH') {

            $rules['senha'] = [
                'nullable',
                'min:6',
                'max:50'
            ];
        }

        return $rules;
    }
}