export class CustomValidation {
    email_pattern: any = /^([\w-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([\w-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/;
    numeric: any = /^[0-9]*\.?[0-9]+$/;
    numeric_specialchar: any =/^(1[ \-\+]{0,3}|\+1[ -\+]{0,3}|\+1|\+)?((\(\+?1-[2-9][0-9]{1,2}\))|(\(\+?[2-8][0-9][0-9]\))|(\(\+?[1-9][0-9]\))|(\(\+?[17]\))|(\([2-9][2-9]\))|([ \-\.]{0,3}[0-9]{2,4}))?([ \-\.][0-9])?([ \-\.]{0,3}[0-9]{2,4}){2,3}$/;
    all_numeric: any = /^[\-+]?[0-9]*\.?[0-9]+$/;
    integer: any = /^[0-9]+$/;
    alpha: any = /^[A-Z]+$/i;
    alpha_spaces: any = /^[A-Z-&' ]+$/i;
    alpha_numeric: any = /^[A-Z0-9]+$/i;
    alpha_numeric_no_space_at_begin: any = /^[^-\s][a-zA-Z0-9_\s-]+$/i;
    password: any = /\s/;
    onlyNoSpaceAllowed: any = /^\S*$/;
}