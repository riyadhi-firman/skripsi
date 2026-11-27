<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateDeviceRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->isAdmin() ?? false;
    }

    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:100'],
            'hostname' => ['nullable', 'string', 'max:150'],
            'ip_address' => ['required', 'ip'],
            'device_type' => ['required', 'in:Router,Switch,Firewall,Access Point,Server,Other'],
            'vendor' => ['nullable', 'string', 'max:100'],
            'model' => ['nullable', 'string', 'max:100'],
            'location' => ['nullable', 'string', 'max:150'],
            'snmp_version' => ['required', 'in:v1,v2c,v3'],
            'snmp_community' => ['nullable', 'string', 'max:100'],
            'snmp_port' => ['nullable', 'integer', 'min:1', 'max:65535'],
            'snmp_security_level' => ['nullable', 'string', 'in:noAuthNoPriv,authNoPriv,authPriv'],
            'snmp_auth_protocol' => ['nullable', 'string', 'in:MD5,SHA,SHA256'],
            'snmp_auth_password' => ['nullable', 'string'],
            'snmp_priv_protocol' => ['nullable', 'string', 'in:DES,AES'],
            'snmp_priv_password' => ['nullable', 'string'],
            'monitoring_interval' => ['required', 'integer', 'min:5', 'max:3600'],
            'timeout' => ['required', 'integer', 'min:1', 'max:60'],
            'retry' => ['required', 'integer', 'min:1', 'max:10'],
            'monitoring_enabled' => ['boolean'],
        ];
    }
}
