import { 
  Controller, 
  Post, 
  Body, 
  Get, 
  Param, 
  Res, 
  HttpStatus, 
  HttpException 
} from '@nestjs/common';
import { Response } from 'express';
import { FormService } from './form.service';
import { CompanyDataDto } from './dto/company-data.dto';

@Controller('form')
export class FormController {
  constructor(private readonly formService: FormService) {}

  @Post('submit')
  async submitForm(@Body() formData: CompanyDataDto) {
    try {
      const response = await this.formService.processFormData(formData);
      return response;
    } catch (error) {
      throw new HttpException(
        `Erro ao processar o formulário: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Get('pdf/:ticketId')
  async getPdf(@Param('ticketId') ticketId: string, @Res() res: Response) {
    try {
      const pdfBuffer = await this.formService.generatePdf(ticketId);
      
      if (!pdfBuffer) {
        throw new HttpException('PDF não encontrado', HttpStatus.NOT_FOUND);
      }
      
      // Configurar os headers da resposta para download do PDF
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename=carta_van_${ticketId}.pdf`);
      
      // Enviar o buffer do PDF como resposta
      return res.send(pdfBuffer);
    } catch (error) {
      throw new HttpException(
        `Erro ao gerar o PDF: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }
}
